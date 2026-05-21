# QuantumMint Bookstore — Project Structure

Reorganized on 2026-02-22. All files are now grouped by service domain.

```
quantummint-bookstore/
├── frontend/              ← React/Vite web app (all UI code)
│   ├── src/
│   │   ├── pages/         ← All 41+ page components (TSX)
│   │   ├── components/    ← Reusable UI components + layout/ui/chat/reviews/panes
│   │   ├── services/      ← Frontend API client hooks (TS)
│   │   ├── contexts/      ← React context providers (Auth, Store)
│   │   ├── utils/         ← Utility functions
│   │   ├── types/         ← TypeScript type definitions
│   │   ├── api/           ← API client layer (client.ts, index.ts, services/)
│   │   ├── lib/           ← Shared frontend library code
│   │   ├── sync/          ← Sync utilities
│   │   ├── App.tsx        ← Root router + route definitions
│   │   ├── index.tsx      ← React entry point
│   │   ├── main.tsx       ← Vite entry point
│   │   ├── index.css      ← Global styles
│   │   └── constants.ts   ← App-wide constants
│   ├── public/            ← Static assets
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── services/              ← All backend microservices
│   ├── auth/              ← Auth & JWT service (Node.js stub)
│   ├── api-gateway/       ← Nginx-based API gateway (stub)
│   ├── subscription/      ← Subscription billing (Node.js/TS)
│   ├── analytics/
│   │   ├── service/       ← Analytics service (Node.js/TS)
│   │   └── engine/        ← Analytics engine (Node.js stub)
│   ├── content/
│   │   ├── service/       ← Content service (Node.js/TS)
│   │   └── api/           ← Content REST API (Node.js/TS)
│   ├── tts/
│   │   ├── node/          ← TTS service (Node.js/TS)
│   │   └── python/        ← TTS microservice (Python/Flask)
│   ├── video/
│   │   ├── service/       ← High-level video service (Node.js/TS)
│   │   ├── api/           ← Video REST API
│   │   ├── processor/     ← GPU video processor (Node.js)
│   │   ├── worker/        ← Processor worker process
│   │   └── streaming/     ← RTMP streaming server
│   ├── voice/
│   │   ├── clone/         ← Voice cloning service (Node.js/TS)
│   │   └── profile/       ← Voice profile service (Node.js/TS)
│   ├── knowledge-graph/   ← Knowledge graph (Python)
│   ├── formula-engine/    ← Math/formula engine (Python)
│   ├── concept-visualizer/← AI concept visualizer (Python)
│   ├── ebook-converter/   ← E-book converter (Python)
│   ├── media-sync/        ← Media sync service (Node.js/TS)
│   ├── ai-gen/            ← AI generation stub (app.py, server.js)
│   └── shared/            ← Cross-service utilities (email, cron, middleware)
│
├── backend/               ← Main REST API server (Node.js, unchanged)
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── admin/                 ← Admin dashboard service (Node.js)
│
├── infrastructure/        ← DevOps and deployment
│   ├── nginx/             ← Nginx configuration
│   ├── monitoring/        ← Grafana monitoring config
│   ├── scripts/           ← Shell scripts (init-subscription-db.sh)
│   ├── docker-compose.yml ← Main Docker Compose file (updated paths)
│   ├── Dockerfile         ← Root Dockerfile
│   ├── .htaccess          ← Apache config
│   └── deploy-siera-books.sh
│
├── database/              ← SQL schemas and seed scripts
│   ├── init-all-databases.sql
│   ├── paygo-schema.sql
│   ├── subscription-schema.sql
│   ├── init-subscription-db.sh
│   └── legacy/            ← Legacy migration scripts
│
├── docs/                  ← All documentation
│   ├── PROJECT_STRUCTURE.md  ← This file
│   ├── BACKEND_INTEGRATION.md
│   ├── DEPLOYMENT.md
│   ├── DESIGN_DEVELOPMENT.md
│   ├── Demo Accounts.md
│   ├── FILE_LOCATIONS.md
│   ├── PAYMENT_SYSTEMS.md
│   ├── USER_ROLES.md
│   ├── README.md
│   └── (DNS, email, setup guides)
│
├── docs/
│   ├── REFUNDS_AND_EXCHANGE_RATES.md  ← Refund API, live rate, worker notifications
│   ├── PAYMENT_SYSTEMS.md
│   └── DEPLOYMENT.md
│
├── config/                ← Environment templates
│   ├── .env.example
│   ├── .env.production
│   ├── .env.local
│   └── metadata.json
│
├── .env                   ← Local dev env (gitignored)
└── .gitignore
```

## Service Port Map

| Service | Port |
|---|---|
| API Gateway (nginx) | 80, 443 |
| Subscription Service | 4100 |
| Content API | 5000 |
| Formula Engine | 5004 |
| TTS Microservice | 5005 |
| Web Frontend | 3000 |
| Admin Dashboard | 3001 |
| Monitoring (Grafana) | 3002 |
| Neo4j Browser | 7474 |
| Streaming (RTMP) | 1935, 8000 |
