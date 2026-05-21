const { BookDraft } = require('../models');
const { main: logger } = require('../utils/logger');

exports.saveDraft = async (req, res) => {
    try {
        const { id, title, metadata, pages, selectedVoiceId } = req.body;
        const userId = req.user.id;

        let draft;
        if (id) {
            draft = await BookDraft.findOne({ where: { id, userId } });
        }

        if (draft) {
            await draft.update({
                title,
                metadata,
                pages,
                selectedVoiceId,
                lastSavedAt: new Date()
            });
        } else {
            draft = await BookDraft.create({
                userId,
                title,
                metadata,
                pages,
                selectedVoiceId,
                lastSavedAt: new Date()
            });
        }

        res.json({ success: true, draft });
    } catch (error) {
        logger.error('Save Draft Error:', error);
        res.status(500).json({ error: 'Failed to save draft' });
    }
};

exports.getDrafts = async (req, res) => {
    try {
        const drafts = await BookDraft.findAll({
            where: { userId: req.user.id },
            order: [['lastSavedAt', 'DESC']]
        });
        res.json(drafts);
    } catch (error) {
        logger.error('Get Drafts Error:', error);
        res.status(500).json({ error: 'Failed to fetch drafts' });
    }
};

exports.getDraft = async (req, res) => {
    try {
        const { id } = req.params;
        const draft = await BookDraft.findOne({
            where: { id, userId: req.user.id }
        });

        if (!draft) {
            return res.status(404).json({ error: 'Draft not found' });
        }

        res.json(draft);
    } catch (error) {
        logger.error('Get Draft Error:', error);
        res.status(500).json({ error: 'Failed to fetch draft' });
    }
};

exports.deleteDraft = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await BookDraft.destroy({
            where: { id, userId: req.user.id }
        });

        if (result === 0) {
            return res.status(404).json({ error: 'Draft not found' });
        }

        res.json({ success: true, message: 'Draft deleted' });
    } catch (error) {
        logger.error('Delete Draft Error:', error);
        res.status(500).json({ error: 'Failed to delete draft' });
    }
};
