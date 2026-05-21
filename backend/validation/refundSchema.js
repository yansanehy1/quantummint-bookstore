const { z } = require('zod');
const { sanitizeText } = require('../utils/sanitize');

const purchaseIdSchema = z.string().uuid('purchaseId must be a valid UUID');

const submitRefundSchema = z.object({
    purchaseId: purchaseIdSchema,
    reason: z
        .string()
        .min(1, 'Reason is required')
        .transform((val) => sanitizeText(val, 1000))
        .refine((val) => val.length >= 10, 'Reason must be at least 10 characters')
        .refine((val) => val.length <= 1000, 'Reason must be at most 1000 characters'),
});

const processRefundSchema = z.object({
    status: z.enum(['approved', 'rejected']),
    adminNotes: z
        .string()
        .optional()
        .transform((val) => (val ? sanitizeText(val, 500) : undefined)),
});

const refundListQuerySchema = z.object({
    status: z.enum(['pending', 'approved', 'rejected', 'all']).optional().default('pending'),
    limit: z.coerce.number().int().min(1).max(100).optional().default(50),
    offset: z.coerce.number().int().min(0).optional().default(0),
});

module.exports = {
    submitRefundSchema,
    processRefundSchema,
    refundListQuerySchema,
};
