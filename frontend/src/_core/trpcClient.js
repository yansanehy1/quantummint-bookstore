"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trpc = void 0;
const client_1 = require("@trpc/client");
// We avoid importing AppRouter type from the service to keep packages decoupled at build time.
// Use an untyped client for now. If you want strong typing, we can extract AppRouter to a shared types package.
exports.trpc = (0, client_1.createTRPCProxyClient)({
    links: [
        (0, client_1.httpBatchLink)({
            url: 'http://localhost:8081/trpc',
            fetch: (input, init) => {
                return fetch(input, { ...init, credentials: 'include' });
            },
        }),
    ],
});
