import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export type Role = "user" | "admin" | "seller";

export type UserCtx = {
  id: number;
  role: Role;
  name?: string;
  email?: string;
} | null;

export type Context = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: UserCtx;
};

export function createContext({ req, res }: CreateExpressContextOptions): Context {
  // very lightweight demo auth: if headers contain x-user-id, set a mock user
  const idHeader = req.header("x-user-id");
  const roleHeader = (req.header("x-user-role") as Role) || "user";
  const user: UserCtx = idHeader ? { id: Number(idHeader), role: roleHeader } : null;
  return { req, res, user };
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }: { ctx: Context; next: (opts?: { ctx?: Context }) => Promise<unknown> }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx });
});
