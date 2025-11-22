import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './routers/app';
import { createContext } from './_core/trpc';

const PORT = process.env.PORT ? Number(process.env.PORT) : 8081;

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(PORT, () => {
  console.log(`[api-service] listening on http://localhost:${PORT}`);
});

export type AppRouter = typeof appRouter;
