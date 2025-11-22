import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
// We avoid importing AppRouter type from the service to keep packages decoupled at build time.
// Use an untyped client for now. If you want strong typing, we can extract AppRouter to a shared types package.

export const trpc = createTRPCProxyClient<any>({
  links: [
    httpBatchLink({
      url: 'http://localhost:8081/trpc',
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        return fetch(input, { ...init, credentials: 'include' });
      },
    }),
  ],
});
