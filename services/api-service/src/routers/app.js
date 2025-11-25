"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const cookies_1 = require("../_core/cookies");
const system_1 = require("./system");
const trpc_1 = require("../_core/trpc");
const zod_1 = require("zod");
exports.appRouter = (0, trpc_1.router)({
    system: system_1.systemRouter,
    auth: (0, trpc_1.router)({
        me: trpc_1.publicProcedure.query((opts) => opts.ctx.user),
        logout: trpc_1.publicProcedure.mutation(({ ctx }) => {
            const cookieOptions = (0, cookies_1.getSessionCookieOptions)(ctx.req);
            ctx.res.clearCookie(cookies_1.COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
            return { success: true };
        }),
    }),
    user: (0, trpc_1.router)({
        profile: trpc_1.publicProcedure.query(({ ctx }) => ctx.user || null),
        updateProfile: trpc_1.protectedProcedure
            .input(zod_1.z.object({
            name: zod_1.z.string().optional(),
            email: zod_1.z.string().email().optional(),
            phone: zod_1.z.string().optional(),
        }))
            .mutation(async ({ ctx, input }) => {
            // TODO: persist changes using DB
            return { success: true, user: ctx.user };
        }),
    }),
    wallet: (0, trpc_1.router)({
        getBalance: trpc_1.protectedProcedure.query(async ({ ctx }) => {
            return { balanceUSD: "0.00", balanceSLL: "0.00", userId: ctx.user.id };
        }),
        deposit: trpc_1.protectedProcedure
            .input(zod_1.z.object({ amount: zod_1.z.string(), currency: zod_1.z.enum(["USD", "SLL"]), provider: zod_1.z.string() }))
            .mutation(async ({ ctx, input }) => {
            // TODO: record deposit transaction
            return { success: true, transactionId: "txn_" + Date.now() };
        }),
        cashout: trpc_1.protectedProcedure
            .input(zod_1.z.object({ amount: zod_1.z.string(), currency: zod_1.z.enum(["USD", "SLL"]), method: zod_1.z.string() }))
            .mutation(async ({ ctx, input }) => {
            // TODO: create cashout request
            return { success: true, requestId: "req_" + Date.now() };
        }),
    }),
    books: (0, trpc_1.router)({
        list: trpc_1.publicProcedure
            .input(zod_1.z.object({ category: zod_1.z.string().optional(), search: zod_1.z.string().optional(), limit: zod_1.z.number().default(20), offset: zod_1.z.number().default(0) }))
            .query(async ({ input }) => {
            // TODO: query books from DB
            return { books: [], total: 0 };
        }),
        getDetails: trpc_1.publicProcedure
            .input(zod_1.z.object({ bookId: zod_1.z.number() }))
            .query(async ({ input }) => {
            // TODO: get book details by id
            return null;
        }),
        purchase: trpc_1.protectedProcedure
            .input(zod_1.z.object({ bookId: zod_1.z.number() }))
            .mutation(async ({ ctx, input }) => {
            // TODO: create purchase
            return { success: true, purchaseId: "purch_" + Date.now() };
        }),
        upload: trpc_1.protectedProcedure
            .input(zod_1.z.object({ title: zod_1.z.string(), description: zod_1.z.string(), category: zod_1.z.string(), priceUSD: zod_1.z.string() }))
            .mutation(async ({ ctx, input }) => {
            // TODO: insert new book
            return { success: true, bookId: 1 };
        }),
    }),
    orders: (0, trpc_1.router)({
        create: trpc_1.protectedProcedure
            .input(zod_1.z.object({
            bookId: zod_1.z.number(),
            amount: zod_1.z.string(),
            currency: zod_1.z.enum(["USD", "SLL"]),
            paymentMethod: zod_1.z.string(),
            billingInfo: zod_1.z.object({
                fullName: zod_1.z.string(),
                email: zod_1.z.string().email(),
                phone: zod_1.z.string(),
                address: zod_1.z.string(),
                city: zod_1.z.string(),
                country: zod_1.z.string(),
                zipCode: zod_1.z.string().optional(),
            }),
        }))
            .mutation(async ({ ctx, input }) => {
            const orderId = `ORD-${Date.now()}`;
            return {
                success: true,
                orderId,
                status: "completed",
                amount: input.amount,
                currency: input.currency,
            };
        }),
        getHistory: trpc_1.protectedProcedure
            .input(zod_1.z.object({ limit: zod_1.z.number().default(10), offset: zod_1.z.number().default(0) }))
            .query(async ({ ctx, input }) => {
            return { orders: [], total: 0 };
        }),
        getDetails: trpc_1.protectedProcedure
            .input(zod_1.z.object({ orderId: zod_1.z.string() }))
            .query(async ({ ctx, input }) => {
            return null;
        }),
    }),
    bookmarks: (0, trpc_1.router)({
        list: trpc_1.protectedProcedure
            .input(zod_1.z.object({ bookId: zod_1.z.number() }))
            .query(async ({ ctx, input }) => {
            return [];
        }),
        create: trpc_1.protectedProcedure
            .input(zod_1.z.object({ bookId: zod_1.z.number(), pageNumber: zod_1.z.number(), audioTimestamp: zod_1.z.number().optional(), note: zod_1.z.string().optional() }))
            .mutation(async ({ ctx, input }) => {
            return { success: true, bookmarkId: 1 };
        }),
        delete: trpc_1.protectedProcedure
            .input(zod_1.z.object({ bookmarkId: zod_1.z.number() }))
            .mutation(async ({ ctx, input }) => {
            return { success: true };
        }),
    }),
    referrals: (0, trpc_1.router)({
        getCode: trpc_1.protectedProcedure.query(async ({ ctx }) => {
            return { code: "REF_" + ctx.user.id, bonusUSD: "5.00" };
        }),
        invite: trpc_1.protectedProcedure
            .input(zod_1.z.object({ email: zod_1.z.string().email() }))
            .mutation(async ({ ctx, input }) => {
            return { success: true };
        }),
    }),
    gifts: (0, trpc_1.router)({
        send: trpc_1.protectedProcedure
            .input(zod_1.z.object({ bookId: zod_1.z.number(), recipientPhone: zod_1.z.string(), note: zod_1.z.string().optional() }))
            .mutation(async ({ ctx, input }) => {
            return { success: true, giftCode: "GIFT_" + Date.now() };
        }),
        claim: trpc_1.publicProcedure
            .input(zod_1.z.object({ giftCode: zod_1.z.string() }))
            .mutation(async ({ ctx, input }) => {
            return { success: true, bookId: 1 };
        }),
    }),
    feedback: (0, trpc_1.router)({
        submit: trpc_1.protectedProcedure
            .input(zod_1.z.object({
            type: zod_1.z.enum(["bug", "feature", "feedback", "support"]),
            subject: zod_1.z.string(),
            message: zod_1.z.string(),
            rating: zod_1.z.number().min(1).max(5).optional(),
        }))
            .mutation(async ({ ctx, input }) => {
            return { success: true, ticketId: "TICKET_" + Date.now() };
        }),
        list: trpc_1.protectedProcedure.query(async ({ ctx }) => {
            return [];
        }),
    }),
});
