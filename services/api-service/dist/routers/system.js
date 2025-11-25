"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemRouter = void 0;
const trpc_1 = require("../_core/trpc");
exports.systemRouter = (0, trpc_1.router)({
    health: trpc_1.publicProcedure.query(() => ({ status: "ok" })),
});
