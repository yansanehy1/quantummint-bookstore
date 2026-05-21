const { Sequelize } = require('sequelize');
const path = require('path');

// Import models
const UserModel = require('./User');
const BookModel = require('./Book');
const PurchaseModel = require('./Purchase');
const TransactionModel = require('./Transaction');
const ReferralModel = require('./Referral');
const SellerModel = require('./Seller');
const VoiceProfileModel = require('./VoiceProfile');
const FormulaModel = require('./Formula');
const FormulaTokenModel = require('./FormulaToken');
const NarrationSegmentModel = require('./NarrationSegment');
const LearnerInteractionModel = require('./LearnerInteraction');
const MediaCueModel = require('./MediaCue');
const NoteModel = require('./Note');
const ReadingSessionModel = require('./ReadingSession');
const QuizModel = require('./Quiz');
const AuditLogModel = require('./AuditLog');
const SubscriptionModel = require('./Subscription');
const RefundRequestModel = require('./RefundRequest');
const UserGroupModel = require('./UserGroup');
const GroupMemberModel = require('./GroupMember');
const BookDraftModel = require('./BookDraft');

module.exports = (sequelize) => {
    // Initialize models
    const User = UserModel(sequelize);
    const Book = BookModel(sequelize);
    const Purchase = PurchaseModel(sequelize);
    const Transaction = TransactionModel(sequelize);
    const Referral = ReferralModel(sequelize);
    const Seller = SellerModel(sequelize);
    const VoiceProfile = VoiceProfileModel(sequelize);
    const Formula = FormulaModel(sequelize);
    const FormulaToken = FormulaTokenModel(sequelize);
    const NarrationSegment = NarrationSegmentModel(sequelize);
    const LearnerInteraction = LearnerInteractionModel(sequelize);
    const MediaCue = MediaCueModel(sequelize);
    const Note = NoteModel(sequelize);
    const ReadingSession = ReadingSessionModel(sequelize);
    const Quiz = QuizModel(sequelize);
    const AuditLog = AuditLogModel(sequelize);
    const Subscription = SubscriptionModel(sequelize);
    const RefundRequest = RefundRequestModel(sequelize);
    const UserGroup = UserGroupModel(sequelize);
    const GroupMember = GroupMemberModel(sequelize);
    const BookDraft = BookDraftModel(sequelize);

    // Define Associations

    // User <-> BookDraft
    User.hasMany(BookDraft, { foreignKey: 'userId' });
    BookDraft.belongsTo(User, { foreignKey: 'userId' });

    // User <-> Purchase
    User.hasMany(Purchase);
    Purchase.belongsTo(User);

    // User <-> RefundRequest
    User.hasMany(RefundRequest, { foreignKey: 'userId' });
    RefundRequest.belongsTo(User, { foreignKey: 'userId' });

    // Purchase <-> RefundRequest
    Purchase.hasOne(RefundRequest, { foreignKey: 'purchaseId' });
    RefundRequest.belongsTo(Purchase, { foreignKey: 'purchaseId' });

    // User <-> Subscription
    User.hasMany(Subscription, { foreignKey: 'userId' });
    Subscription.belongsTo(User, { foreignKey: 'userId' });

    // Sponsor <-> Subscription (Sponsored subscriptions)
    User.hasMany(Subscription, { as: 'SponsoredSubscriptions', foreignKey: 'sponsorId' });
    Subscription.belongsTo(User, { as: 'Sponsor', foreignKey: 'sponsorId' });

    // UserGroup <-> Subscription (Group subscriptions)
    UserGroup.hasMany(Subscription, { foreignKey: 'groupId' });
    Subscription.belongsTo(UserGroup, { foreignKey: 'groupId' });

    // UserGroup <-> User (Sponsor of the group)
    User.hasMany(UserGroup, { as: 'SponsoredGroups', foreignKey: 'sponsorId' });
    UserGroup.belongsTo(User, { as: 'GroupSponsor', foreignKey: 'sponsorId' });

    // UserGroup <-> GroupMember
    UserGroup.hasMany(GroupMember, { foreignKey: 'groupId', onDelete: 'CASCADE' });
    GroupMember.belongsTo(UserGroup, { foreignKey: 'groupId' });

    // User <-> GroupMember
    User.hasMany(GroupMember, { foreignKey: 'userId' });
    GroupMember.belongsTo(User, { foreignKey: 'userId' });

    // Book <-> Purchase
    Book.hasMany(Purchase);
    Purchase.belongsTo(Book);

    // User <-> Transaction
    User.hasMany(Transaction, { foreignKey: 'userId' });
    Transaction.belongsTo(User, { foreignKey: 'userId' });

    // User <-> Seller
    User.hasOne(Seller, { foreignKey: 'userId' });
    Seller.belongsTo(User, { foreignKey: 'userId' });

    // User <-> Book (Seller's books)
    Seller.hasMany(Book, { foreignKey: 'sellerId' });
    Book.belongsTo(Seller, { foreignKey: 'sellerId' });

    // User <-> Referral (Referrer)
    User.hasMany(Referral, { as: 'ReferralsSent', foreignKey: 'referrerId' });
    Referral.belongsTo(User, { as: 'Referrer', foreignKey: 'referrerId' });

    // User <-> Referral (Referred)
    User.hasOne(Referral, { as: 'ReferralReceived', foreignKey: 'referredId' });
    Referral.belongsTo(User, { as: 'Referred', foreignKey: 'referredId' });

    // Seller <-> VoiceProfile
    Seller.hasMany(VoiceProfile, { foreignKey: 'educatorId' });
    VoiceProfile.belongsTo(Seller, { foreignKey: 'educatorId' });

    // Book <-> Formula
    Book.hasMany(Formula, { foreignKey: 'bookId' });
    Formula.belongsTo(Book, { foreignKey: 'bookId' });

    // Formula <-> FormulaToken
    Formula.hasMany(FormulaToken, { foreignKey: 'formulaId' });
    FormulaToken.belongsTo(Formula, { foreignKey: 'formulaId' });

    // Book <-> NarrationSegment
    Book.hasMany(NarrationSegment, { foreignKey: 'bookId' });
    NarrationSegment.belongsTo(Book, { foreignKey: 'bookId' });

    // VoiceProfile <-> NarrationSegment
    VoiceProfile.hasMany(NarrationSegment, { foreignKey: 'voiceProfileId' });
    NarrationSegment.belongsTo(VoiceProfile, { foreignKey: 'voiceProfileId' });

    // User <-> LearnerInteraction
    User.hasMany(LearnerInteraction, { foreignKey: 'userId' });
    LearnerInteraction.belongsTo(User, { foreignKey: 'userId' });

    // Formula <-> LearnerInteraction
    Formula.hasMany(LearnerInteraction, { foreignKey: 'formulaId' });
    LearnerInteraction.belongsTo(Formula, { foreignKey: 'formulaId' });

    // FormulaToken <-> LearnerInteraction
    FormulaToken.hasMany(LearnerInteraction, { foreignKey: 'tokenId' });
    LearnerInteraction.belongsTo(FormulaToken, { foreignKey: 'tokenId' });

    // Book <-> MediaCue
    Book.hasMany(MediaCue, { foreignKey: 'book_id' });
    MediaCue.belongsTo(Book, { foreignKey: 'book_id' });

    // User <-> Note
    User.hasMany(Note, { foreignKey: 'userId' });
    Note.belongsTo(User, { foreignKey: 'userId' });

    // Book <-> Note
    Book.hasMany(Note, { foreignKey: 'bookId' });
    Note.belongsTo(Book, { foreignKey: 'bookId' });

    // User <-> ReadingSession
    User.hasMany(ReadingSession, { foreignKey: 'userId' });
    ReadingSession.belongsTo(User, { foreignKey: 'userId' });

    // Book <-> ReadingSession
    Book.hasMany(ReadingSession, { foreignKey: 'bookId' });
    ReadingSession.belongsTo(Book, { foreignKey: 'bookId' });

    // Book <-> Quiz
    Book.hasMany(Quiz, { foreignKey: 'bookId' });
    Quiz.belongsTo(Book, { foreignKey: 'bookId' });

    // User <-> AuditLog
    User.hasMany(AuditLog, { foreignKey: 'adminId' });
    AuditLog.belongsTo(User, { foreignKey: 'adminId' });

    const models = {
        User,
        Book,
        Purchase,
        Transaction,
        Referral,
        Seller,
        VoiceProfile,
        Formula,
        FormulaToken,
        NarrationSegment,
        LearnerInteraction,
        MediaCue,
        Note,
        ReadingSession,
        Quiz,
        AuditLog,
        Subscription,
        RefundRequest,
        UserGroup,
        GroupMember,
        BookDraft,
        sequelize,
    };

    // Attach models to module.exports so `const { User } = require('../models')` works
    // after initModels(sequelize) is called from app bootstrap (before route imports).
    Object.assign(module.exports, models);

    return models;
};

/**
 * Returns initialized models. Throws if bootstrap has not run yet.
 */
module.exports.getModels = () => {
    if (!module.exports.sequelize || !module.exports.User) {
        throw new Error('Models not initialized. Call require("./models")(sequelize) first.');
    }
    return module.exports;
};
