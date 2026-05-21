const { UserGroup, GroupMember, User, Subscription, Transaction, AuditLog } = require('../models');
const { uuidv4 } = require('../utils/id');
const { main: logger } = require('../utils/logger');
const SUBSCRIPTION_PLANS = require('../config/subscriptionPlans');

/**
 * Admin: Create a Closed User Group (CUG)
 */
exports.createGroup = async (req, res) => {
    try {
        const { name, description, type, sponsorId, sponsorEmail, maxMembers, prepaidBalance, currency, allowedBookIds } = req.body;

        let finalSponsorId = sponsorId;
        
        // Lookup sponsor by email if ID not provided
        if (!finalSponsorId && sponsorEmail) {
            const sponsor = await User.findOne({ where: { email: sponsorEmail } });
            if (sponsor) finalSponsorId = sponsor.id;
        }

        const group = await UserGroup.create({
            id: uuidv4(),
            name,
            description,
            type: type || 'CUG',
            sponsorId: finalSponsorId,
            maxMembers: maxMembers || 2000,
            prepaidBalance: prepaidBalance || 0,
            currency: currency || 'SLL',
            allowedBookIds: allowedBookIds || null,
            status: 'pending'
        });

        logger.info(`[GroupController] CUG created: ${group.id} (${name}) by admin ${req.user.id}`);
        res.status(201).json({ success: true, group });
    } catch (error) {
        logger.error('[GroupController] Create Group Error:', error);
        res.status(500).json({ error: 'Failed to create group' });
    }
};

/**
 * Admin: Activate a group after verifying prepayment
 */
exports.activateGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await UserGroup.findByPk(id);

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        if (group.prepaidBalance <= 0) {
            return res.status(400).json({ error: 'Group must have a prepaid balance before activation' });
        }

        await group.update({ status: 'active' });
        
        logger.info(`[GroupController] CUG activated: ${id} by admin ${req.user.id}`);
        res.json({ success: true, group });
    } catch (error) {
        logger.error('[GroupController] Activate Group Error:', error);
        res.status(500).json({ error: 'Failed to activate group' });
    }
};

/**
 * Admin/Sponsor: Add users to a group in bulk
 */
exports.bulkAddMembers = async (req, res) => {
    try {
        const { id: groupId } = req.params;
        const { userEmails } = req.body; // Array of emails

        const group = await UserGroup.findByPk(groupId, {
            include: [{ model: GroupMember, attributes: ['id'] }]
        });
        if (!group) return res.status(404).json({ error: 'Group not found' });

        // Check if caller is admin or group sponsor
        if (req.user.role !== 'admin' && group.sponsorId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to add members to this group' });
        }

        const currentMemberCount = group.GroupMembers.length;
        const spaceLeft = group.maxMembers - currentMemberCount;

        if (spaceLeft <= 0) {
            return res.status(400).json({ error: `Group is full. Max capacity: ${group.maxMembers}` });
        }

        const userEmailsToProcess = userEmails.slice(0, spaceLeft);
        const skippedEmails = userEmails.slice(spaceLeft);

        const users = await User.findAll({ where: { email: userEmailsToProcess } });
        const foundEmails = users.map(u => u.email);
        const missingEmails = userEmailsToProcess.filter(e => !foundEmails.includes(e));

        const membersToCreate = users.map(user => ({
            id: uuidv4(),
            groupId,
            userId: user.id,
            status: 'active'
        }));

        await GroupMember.bulkCreate(membersToCreate, { ignoreDuplicates: true });

        logger.info(`[GroupController] Bulk added ${membersToCreate.length} members to group ${groupId}`);
        res.json({ 
            success: true, 
            addedCount: membersToCreate.length,
            missingEmails,
            skippedBecauseFull: skippedEmails
        });
    } catch (error) {
        logger.error('[GroupController] Bulk Add Members Error:', error);
        res.status(500).json({ error: 'Failed to add members' });
    }
};

/**
 * Group Subscription: Activate subscriptions for all group members using prepaid balance
 */
exports.activateGroupSubscriptions = async (req, res) => {
    try {
        const { id: groupId } = req.params;
        const { planId } = req.body;

        const group = await UserGroup.findByPk(groupId, {
            include: [{ model: GroupMember, where: { status: 'active' } }]
        });

        if (!group) return res.status(404).json({ error: 'Group not found or has no active members' });

        const plan = SUBSCRIPTION_PLANS[planId];
        if (!plan) return res.status(400).json({ error: 'Invalid subscription plan' });

        const pricePerUser = group.currency === 'USD' ? plan.priceUSD : plan.priceSLL;
        const totalCost = pricePerUser * group.GroupMembers.length;

        logger.info(`[GroupController] Activating group subscriptions for ${group.name}:`);
        logger.info(`- Plan: ${planId} (${plan.durationHours} hrs)`);
        logger.info(`- Members: ${group.GroupMembers.length}`);
        logger.info(`- Price per user: ${pricePerUser} ${group.currency}`);
        logger.info(`- Total cumulative cost: ${totalCost} ${group.currency}`);

        if (parseFloat(group.prepaidBalance) < totalCost) {
            return res.status(400).json({ 
                error: 'Insufficient prepaid balance for group subscription',
                required: totalCost,
                available: group.prepaidBalance,
                perUser: pricePerUser,
                memberCount: group.GroupMembers.length
            });
        }

        const endDate = new Date();
        endDate.setHours(endDate.getHours() + plan.durationHours);

        await UserGroup.sequelize.transaction(async (t) => {
            // Deduct from group balance
            await group.update({
                prepaidBalance: (parseFloat(group.prepaidBalance) - totalCost).toFixed(2)
            }, { transaction: t });

            // Create subscriptions for each member
            const subscriptions = group.GroupMembers.map(member => ({
                id: uuidv4(),
                userId: member.userId,
                groupId: group.id,
                sponsorId: group.sponsorId,
                planId,
                status: 'active',
                startDate: new Date(),
                endDate,
                amount: pricePerUser,
                currency: group.currency,
                allowedBookIds: group.allowedBookIds // Pass book restrictions to the subscription
            }));

            await Subscription.bulkCreate(subscriptions, { transaction: t });

            // Log administrative transaction
            await Transaction.create({
                id: uuidv4(),
                userId: group.sponsorId || req.user.id,
                type: 'purchase',
                amount: totalCost,
                currency: group.currency,
                status: 'completed',
                description: `Group Subscription: ${group.name} - ${planId} plan for ${group.GroupMembers.length} users`
            }, { transaction: t });
        });

        logger.info(`[GroupController] Activated group subscriptions for ${group.name}: ${group.GroupMembers.length} users`);
        res.json({ success: true, message: `Activated subscriptions for ${group.GroupMembers.length} members` });

    } catch (error) {
        logger.error('[GroupController] Activate Group Subscriptions Error:', error);
        res.status(500).json({ error: 'Failed to activate group subscriptions' });
    }
};

/**
 * Admin: Adjust group prepaid balance
 */
exports.adjustGroupBalance = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description } = req.body;

        const group = await UserGroup.findByPk(id);
        if (!group) return res.status(404).json({ error: 'Group not found' });

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount)) return res.status(400).json({ error: 'Invalid amount' });

        const oldBalance = group.prepaidBalance;
        group.prepaidBalance = (parseFloat(group.prepaidBalance) + numericAmount).toFixed(2);
        await group.save();

        // Record Audit Log
        await AuditLog.create({
            id: uuidv4(),
            adminId: req.user.id,
            action: 'ADJUST_GROUP_BALANCE',
            targetId: id,
            details: {
                oldBalance,
                newBalance: group.prepaidBalance,
                adjustment: numericAmount,
                currency: group.currency,
                description
            }
        });

        // Record administrative transaction for the sponsor
        if (group.sponsorId) {
            await Transaction.create({
                id: uuidv4(),
                userId: group.sponsorId,
                type: 'admin_adjustment',
                amount: Math.abs(numericAmount),
                currency: group.currency,
                status: 'completed',
                description: description || `Group balance ${numericAmount > 0 ? 'credit' : 'debit'} adjustment by admin`
            });
        }

        logger.info(`[GroupController] Group ${id} balance adjusted: ${oldBalance} -> ${group.prepaidBalance}`);
        res.json({ success: true, balance: group.prepaidBalance });
    } catch (error) {
        logger.error('[GroupController] Adjust Group Balance Error:', error);
        res.status(500).json({ error: 'Failed to adjust balance' });
    }
};

/**
 * List groups for admin
 */
exports.listGroups = async (req, res) => {
    try {
        const groups = await UserGroup.findAll({
            include: [
                { model: User, as: 'GroupSponsor', attributes: ['name', 'email'] },
                { model: GroupMember, attributes: ['id'] }
            ]
        });
        res.json(groups);
    } catch (error) {
        logger.error('[GroupController] List Groups Error:', error);
        res.status(500).json({ error: 'Failed to list groups' });
    }
};
