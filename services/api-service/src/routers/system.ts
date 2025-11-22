import { router, publicProcedure } from "../_core/trpc";

export const systemRouter = router({
  health: publicProcedure.query(() => ({ status: "ok" as const })),
});
