import { COOKIE_NAME, getSessionCookieOptions } from "../_core/cookies";
import { systemRouter } from "./system";
import { publicProcedure, router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  user: router({
    profile: publicProcedure.query(({ ctx }) => ctx.user || null),
    updateProfile: protectedProcedure
      .input(
        z.object({
          name: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // TODO: persist changes using DB
        return { success: true, user: ctx.user } as const;
      }),
  }),

  wallet: router({
    getBalance: protectedProcedure.query(async ({ ctx }) => {
      return { balanceUSD: "0.00", balanceSLL: "0.00", userId: ctx.user!.id } as const;
    }),

    deposit: protectedProcedure
      .input(
        z.object({ amount: z.string(), currency: z.enum(["USD", "SLL"]), provider: z.string() })
      )
      .mutation(async ({ ctx, input }) => {
        // TODO: record deposit transaction
        return { success: true, transactionId: "txn_" + Date.now() } as const;
      }),

    cashout: protectedProcedure
      .input(
        z.object({ amount: z.string(), currency: z.enum(["USD", "SLL"]), method: z.string() })
      )
      .mutation(async ({ ctx, input }) => {
        // TODO: create cashout request
        return { success: true, requestId: "req_" + Date.now() } as const;
      }),
  }),

  books: router({
    list: publicProcedure
      .input(
        z.object({ category: z.string().optional(), search: z.string().optional(), limit: z.number().default(20), offset: z.number().default(0) })
      )
      .query(async ({ input }) => {
        // TODO: query books from DB
        return { books: [] as any[], total: 0 } as const;
      }),

    getDetails: publicProcedure
      .input(z.object({ bookId: z.number() }))
      .query(async ({ input }) => {
        // TODO: get book details by id
        return null;
      }),

    purchase: protectedProcedure
      .input(z.object({ bookId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // TODO: create purchase
        return { success: true, purchaseId: "purch_" + Date.now() } as const;
      }),

    upload: protectedProcedure
      .input(
        z.object({ title: z.string(), description: z.string(), category: z.string(), priceUSD: z.string() })
      )
      .mutation(async ({ ctx, input }) => {
        // TODO: insert new book
        return { success: true, bookId: 1 } as const;
      }),
  }),

  orders: router({
    create: protectedProcedure
      .input(
        z.object({
          bookId: z.number(),
          amount: z.string(),
          currency: z.enum(["USD", "SLL"]),
          paymentMethod: z.string(),
          billingInfo: z.object({
            fullName: z.string(),
            email: z.string().email(),
            phone: z.string(),
            address: z.string(),
            city: z.string(),
            country: z.string(),
            zipCode: z.string().optional(),
          }),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const orderId = `ORD-${Date.now()}`;
        return {
          success: true,
          orderId,
          status: "completed" as const,
          amount: input.amount,
          currency: input.currency,
        } as const;
      }),

    getHistory: protectedProcedure
      .input(z.object({ limit: z.number().default(10), offset: z.number().default(0) }))
      .query(async ({ ctx, input }) => {
        return { orders: [] as any[], total: 0 } as const;
      }),

    getDetails: protectedProcedure
      .input(z.object({ orderId: z.string() }))
      .query(async ({ ctx, input }) => {
        return null;
      }),
  }),

  bookmarks: router({
    list: protectedProcedure
      .input(z.object({ bookId: z.number() }))
      .query(async ({ ctx, input }) => {
        return [] as any[];
      }),

    create: protectedProcedure
      .input(
        z.object({ bookId: z.number(), pageNumber: z.number(), audioTimestamp: z.number().optional(), note: z.string().optional() })
      )
      .mutation(async ({ ctx, input }) => {
        return { success: true, bookmarkId: 1 } as const;
      }),

    delete: protectedProcedure
      .input(z.object({ bookmarkId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return { success: true } as const;
      }),
  }),

  referrals: router({
    getCode: protectedProcedure.query(async ({ ctx }) => {
      return { code: "REF_" + ctx.user!.id, bonusUSD: "5.00" } as const;
    }),

    invite: protectedProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ ctx, input }) => {
        return { success: true } as const;
      }),
  }),

  gifts: router({
    send: protectedProcedure
      .input(z.object({ bookId: z.number(), recipientPhone: z.string(), note: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        return { success: true, giftCode: "GIFT_" + Date.now() } as const;
      }),

    claim: publicProcedure
      .input(z.object({ giftCode: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return { success: true, bookId: 1 } as const;
      }),
  }),

  feedback: router({
    submit: protectedProcedure
      .input(
        z.object({
          type: z.enum(["bug", "feature", "feedback", "support"]),
          subject: z.string(),
          message: z.string(),
          rating: z.number().min(1).max(5).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return { success: true, ticketId: "TICKET_" + Date.now() } as const;
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return [] as any[];
    }),
  }),
});

export type AppRouter = typeof appRouter;
