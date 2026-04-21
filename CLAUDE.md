# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bilingual (Khmer + English) job hosting platform for Cambodia — a 3-sided marketplace connecting Job Seekers, Employers, and Admins.

## Monorepo Structure

```
/
├── apps/
│   ├── web/          # Next.js 16 frontend (App Router)
│   └── api/          # NestJS backend
├── packages/
│   └── shared/       # Shared types
├── prisma/
│   └── schema.prisma # Database schema
└── prisma.config.ts  # Prisma config with migrations
```

## Commands

### Root (pnpm workspace)
```bash
pnpm install              # Install all dependencies
pnpm dev:api              # Start API dev server
pnpm dev:web              # Start web dev server
```

### API (apps/api)
```bash
cd apps/api
pnpm dev                  # Start NestJS in watch mode
pnpm build                # Build for production
pnpm test                 # Run unit tests
pnpm test:e2e             # Run E2E tests
npx prisma generate       # Generate Prisma client
npx prisma migrate dev    # Run migrations
```

### Web (apps/web)
```bash
cd apps/web
pnpm dev                  # Start Next.js dev server
pnpm build                # Build for production
pnpm lint                 # Run ESLint
```

## Architecture

### Frontend (apps/web)
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Fonts:** Geist Sans + Geist Mono
- **Path aliases:** `@/*` → `apps/web/*`

### Backend (apps/api)
- **Framework:** NestJS with modular architecture
- **ORM:** Prisma (output: `apps/api/generated/prisma`)
- **Database:** PostgreSQL via Neon
- **Auth:** JWT + Local (email/password) + GitHub OAuth
- **Real-time:** Socket.IO (chat + notifications)
- **File upload:** Cloudinary
- **API docs:** Swagger at `/api/docs`

### Key Patterns

**Mapper Pattern:** All Prisma entities are transformed to DTOs via dedicated mapper classes (e.g., `JobsMapper.toDto()`). Mappers define `include` shapes as `const` and export both the include and the mapper class.

**DTOs:** Use `class-validator` decorators. Required fields use `!`, optional use `?`.

**Controllers:** Every endpoint must have `@ApiTags`, `@ApiOperation`, `@ApiParam`/`@ApiQuery`, and `@ApiResponse` decorators.

**Global ValidationPipe:** `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`.

## Environment Variables

Required in `.env` (see `.env.example`):
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_CALLBACK_URL`
- `GMAIL_USER`, `GMAIL_APP_PASSWORD` — for email verification
- `CLOUDINARY_*` — for file uploads
- `FRONTEND_URL` — frontend origin
- `PORT` — API port (default: 4000)

## Database Schema

Core entities: `User`, `Profile`, `Company`, `Job`, `Application`, `Conversation`, `Message`, `Notification`

Enums: `Role` (SEEKER/EMPLOYER/ADMIN), `JobType`, `ApplicationStatus`

## Important Conventions

- All IDs use `cuid()`
- Refresh tokens stored in httpOnly cookies only
- bcrypt rounds: 12
- No inline Prisma transformations — always use mappers
- No hardcoded UI strings (i18n planned via next-intl)

## Files to Know

- `GEMINI.md` — Detailed blueprint with API endpoints, folder structures, and implementation rules
- `apps/web/AGENTS.md` — Next.js version warning — read `node_modules/next/dist/docs/` for current APIs
- `apps/web/CLAUDE.md` — References AGENTS.md
- `prisma.config.ts` — Prisma configuration with migration paths
