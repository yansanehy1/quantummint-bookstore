"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedProcedure = exports.publicProcedure = exports.router = void 0;
exports.createContext = createContext;
const server_1 = require("@trpc/server");
function createContext({ req, res }) {
    // very lightweight demo auth: if headers contain x-user-id, set a mock user
    const idHeader = req.header("x-user-id");
    const roleHeader = req.header("x-user-role") || "user";
    const user = idHeader ? { id: Number(idHeader), role: roleHeader } : null;
    return { req, res, user };
}
const t = server_1.initTRPC.context().create();
exports.router = t.router;
exports.publicProcedure = t.procedure;
exports.protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
    if (!ctx.user) {
        throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({ ctx });
});
