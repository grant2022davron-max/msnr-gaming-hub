# MSNR Gaming Hub — Phase 1 foundation

This is a runnable Phase 1 codebase, not a claim that every roadmap feature is finished.

## Included
- React + TypeScript + Vite mobile-first Mini App UI.
- Express + TypeScript backend.
- PostgreSQL + Prisma schema.
- Server-side Telegram Mini App `initData` signature validation.
- Server-authoritative tap endpoint, energy regeneration, daily tap cap, idempotency key and point ledger.
- Five selectable themes.
- Automated tests for tap logic and Telegram signature validation.

## Not yet implemented
Machines/offline income, five playable mini-games, streaks, weekly leaderboard payouts, referrals, payments, clans, season pass, marketplace and advanced progression are later phases. UI labels these as planned rather than pretending they work.

## Requirements
Node.js 20+ and PostgreSQL 15+.

## Setup
1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `TELEGRAM_BOT_TOKEN`.
2. Run `npm install`.
3. Run `npm run db:generate -w apps/api`.
4. Run `npm run db:migrate -w apps/api`.
5. Run `npm run dev`.

Frontend: http://localhost:5173 — API health: http://localhost:3001/health
Tests: `npm test`

## Telegram deployment
Create a bot with BotFather and put its token in the backend environment only. Deploy the frontend to HTTPS and configure the Mini App URL in BotFather. Deploy the API separately, set `VITE_API_URL` at frontend build time and `WEB_ORIGIN` on the API. Never put the bot token in a `VITE_` variable. Configure managed PostgreSQL, backups, HTTPS, monitoring and migration execution before production use.

## API
- `GET /health`
- `POST /api/auth/telegram` `{ "initData": "..." }`
- `GET /api/me` with `Authorization: Bearer <token>`
- `POST /api/tap` `{ "requestId": "uuid", "tapCount": 1 }`
- `PATCH /api/me/theme` `{ "theme": "msnr-phantom" }`

## Phase checklist
- [x] Workspace structure, React UI and API
- [x] Telegram initData validation
- [x] Tap endpoint, energy regeneration and daily limit
- [x] Prisma schema and point ledger
- [x] Five theme choices
- [ ] Live deployment and verification inside Telegram
- [ ] Phase 2: 20 machines, offline income, five mini-games, streak, weekly leaderboard
- [ ] Phase 3: achievements, skins, missions, profiles, season pass, clans, tournaments
- [ ] Phase 4: live events, tech tree, prestige, mystery boxes, duels, marketplace

Economy defaults are configurable in `apps/api/src/config.ts`. Unapproved prices and reward values are not presented as final business decisions.
