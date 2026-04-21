# GEMINI.md — Job Hosting Platform (Cambodia 🇰🇭)

> This file is the master prompt and blueprint for Gemini CLI to scaffold, generate, and assist with this full-stack job hosting platform. Follow every section carefully and apply best practices throughout.

---

## 🧠 Project Overview

Build a **bilingual (Khmer 🇰🇭 + English) job hosting web platform** for Cambodia. This is a **3-sided marketplace** with:

- **Job Seekers** — browse, apply, chat with employers
- **Employers** — post jobs, manage applications, chat with candidates
- **Admins** — manage users, remove inappropriate jobs, oversee platform

The platform is **free for all users**. All job types are supported: full-time, part-time, freelance, and internship. Jobs go **live instantly** and admins can remove them if they violate rules.

---

## 🗂️ Monorepo Structure

```
/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   └── shared/       # Shared types, DTOs, constants
├── prisma/
│   └── schema.prisma
├── .env
├── GEMINI.md
└── README.md
```

---

## 🖥️ Frontend — Next.js App (apps/web)

### Tech Stack
- Framework: Next.js 14+ (App Router)
- State Management: Redux Toolkit + RTK Query
- Styling: Tailwind CSS
- i18n: next-intl (Khmer km + English en)
- Forms: React Hook Form + Zod
- UI Components: shadcn/ui
- Icons: Lucide React
- File Upload: react-dropzone (CV PDF + profile images)
- Real-time Chat: Socket.IO client

### Folder Structure
```
apps/web/
├── app/
│   ├── [locale]/
│   │   ├── (public)/
│   │   │   ├── page.tsx                  # Home
│   │   │   ├── jobs/
│   │   │   │   ├── page.tsx              # Browse all jobs
│   │   │   │   └── [id]/page.tsx         # Job detail
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (seeker)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── applications/page.tsx
│   │   │   └── chat/page.tsx
│   │   ├── (employer)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── jobs/page.tsx
│   │   │   ├── jobs/new/page.tsx
│   │   │   ├── jobs/[id]/applicants/page.tsx
│   │   │   └── chat/page.tsx
│   │   └── (admin)/
│   │       ├── dashboard/page.tsx
│   │       ├── users/page.tsx
│   │       └── jobs/page.tsx
├── components/
│   ├── layout/Navbar.tsx
│   ├── layout/Footer.tsx
│   ├── layout/Sidebar.tsx
│   ├── jobs/JobCard.tsx
│   ├── jobs/JobFilter.tsx
│   ├── jobs/JobForm.tsx
│   ├── chat/ChatWindow.tsx
│   ├── chat/MessageBubble.tsx
│   ├── chat/ConversationList.tsx
│   ├── notifications/NotificationBell.tsx
│   └── ui/                               # shadcn components
├── store/
│   ├── index.ts
│   ├── slices/authSlice.ts
│   ├── slices/notificationSlice.ts
│   ├── slices/chatSlice.ts
│   ├── api/jobsApi.ts
│   ├── api/authApi.ts
│   ├── api/applicationsApi.ts
│   └── api/chatApi.ts
├── messages/
│   ├── en.json
│   └── km.json
├── middleware.ts
└── i18n.ts
```

### i18n Implementation

Use next-intl with locale prefix routing:
- /en/jobs → English
- /km/jobs → Khmer

All UI strings must be in both messages/en.json and messages/km.json.
Never hardcode UI text — always use useTranslations() hook.

Example en.json:
{
  "nav": { "jobs": "Browse Jobs", "login": "Login", "register": "Register" },
  "job": { "apply": "Apply Now", "type": { "fullTime": "Full-time", "partTime": "Part-time" } }
}

Example km.json:
{
  "nav": { "jobs": "រកមើលការងារ", "login": "ចូល", "register": "ចុះឈ្មោះ" },
  "job": { "apply": "ដាក់ពាក្យឥឡូវ", "type": { "fullTime": "ពេញម៉ោង", "partTime": "កន្លះម៉ោង" } }
}

---

## ⚙️ Backend — NestJS API (apps/api)

### Tech Stack
- Framework: NestJS (modular architecture)
- ORM: Prisma
- Database: PostgreSQL via Neon (serverless)
- Auth: Passport.js — JWT + Local (Gmail SMTP) + GitHub OAuth2
- File Upload: Cloudinary (images + PDFs)
- Docs: Swagger (OpenAPI)
- Real-time: Socket.IO (chat + notifications)
- Validation: class-validator + class-transformer
- Config: @nestjs/config with .env validation

### Folder Structure
```
apps/api/src/
├── app.module.ts
├── main.ts
├── prisma/prisma.module.ts
├── prisma/prisma.service.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/jwt.strategy.ts
│   ├── strategies/local.strategy.ts
│   ├── strategies/github.strategy.ts
│   ├── guards/jwt-auth.guard.ts
│   ├── guards/local-auth.guard.ts
│   ├── guards/github-auth.guard.ts
│   ├── guards/roles.guard.ts
│   ├── decorators/current-user.decorator.ts
│   └── decorators/roles.decorator.ts
├── users/
├── jobs/
├── applications/
├── chat/
├── notifications/
├── upload/
└── admin/
```

### Auth Flow

#### Local (Email + Password)
1. Register with email + password (bcrypt, 12 rounds)
2. Send email verification via Nodemailer (Gmail SMTP App Password)
3. Login → access_token (JWT 15m) + refresh_token (JWT 7d, httpOnly cookie)
4. Refresh endpoint rotates tokens

#### GitHub OAuth
1. GET /auth/github → redirect to GitHub
2. GET /auth/github/callback → link or create user → return JWT
3. Roles: SEEKER, EMPLOYER, ADMIN

### API Endpoints

#### Auth
```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
GET    /auth/github
GET    /auth/github/callback
GET    /auth/verify-email
```

#### Users
```
GET    /users/me
PATCH  /users/me
PATCH  /users/me/cv
PATCH  /users/me/avatar
```

#### Jobs
```
GET    /jobs                    # paginated, filterable
GET    /jobs/:id
POST   /jobs                    # EMPLOYER only
PATCH  /jobs/:id                # owner only
DELETE /jobs/:id                # owner or ADMIN
```

#### Applications
```
POST   /jobs/:id/apply          # SEEKER only
GET    /applications/mine       # SEEKER
GET    /jobs/:id/applicants     # EMPLOYER owner
PATCH  /applications/:id/status # EMPLOYER: reviewed/accepted/rejected
```

#### Chat (REST + Socket.IO)
```
GET    /chat/conversations
GET    /chat/conversations/:id/messages
```
Socket events: sendMessage, newMessage, typing

#### Notifications
```
GET    /notifications
PATCH  /notifications/:id/read
PATCH  /notifications/read-all
```
Socket event: newNotification pushed to user's room

#### Upload
```
POST   /upload/image
POST   /upload/pdf
```

#### Admin
```
GET    /admin/users
PATCH  /admin/users/:id/ban
GET    /admin/jobs
DELETE /admin/jobs/:id
GET    /admin/stats
```

---

## 🗄️ Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role { SEEKER EMPLOYER ADMIN }
enum JobType { FULL_TIME PART_TIME FREELANCE INTERNSHIP }
enum ApplicationStatus { PENDING REVIEWED ACCEPTED REJECTED }

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String?
  githubId      String?   @unique
  role          Role      @default(SEEKER)
  isVerified    Boolean   @default(false)
  isBanned      Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  profile       Profile?
  company       Company?
  jobs          Job[]
  applications  Application[]
  sentMessages  Message[]     @relation("SentMessages")
  conversations ConversationParticipant[]
  notifications Notification[]
}

model Profile {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  firstName String
  lastName  String
  avatar    String?
  bio       String?
  location  String?
  skills    String[]
  cvUrl     String?
  updatedAt DateTime @updatedAt
}

model Company {
  id          String  @id @default(cuid())
  userId      String  @unique
  user        User    @relation(fields: [userId], references: [id])
  name        String
  logo        String?
  description String?
  website     String?
  location    String?
  jobs        Job[]
}

model Job {
  id           String    @id @default(cuid())
  title        String
  description  String
  type         JobType
  category     String
  location     String
  salaryMin    Int?
  salaryMax    Int?
  deadline     DateTime?
  isActive     Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  employerId   String
  employer     User      @relation(fields: [employerId], references: [id])
  companyId    String?
  company      Company?  @relation(fields: [companyId], references: [id])
  applications Application[]
}

model Application {
  id        String            @id @default(cuid())
  status    ApplicationStatus @default(PENDING)
  coverNote String?
  createdAt DateTime          @default(now())
  updatedAt DateTime          @updatedAt
  jobId     String
  job       Job    @relation(fields: [jobId], references: [id])
  seekerId  String
  seeker    User   @relation(fields: [seekerId], references: [id])
  @@unique([jobId, seekerId])
}

model Conversation {
  id           String    @id @default(cuid())
  createdAt    DateTime  @default(now())
  participants ConversationParticipant[]
  messages     Message[]
}

model ConversationParticipant {
  userId         String
  conversationId String
  user           User         @relation(fields: [userId], references: [id])
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  @@id([userId, conversationId])
}

model Message {
  id             String       @id @default(cuid())
  content        String
  createdAt      DateTime     @default(now())
  senderId       String
  sender         User         @relation("SentMessages", fields: [senderId], references: [id])
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id])
}

model Notification {
  id        String   @id @default(cuid())
  type      String
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}
```

---

## 🔐 Environment Variables (.env)

```
DATABASE_URL="postgresql://..."
JWT_SECRET="your-super-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_REFRESH_EXPIRES_IN="7d"
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GITHUB_CALLBACK_URL="http://localhost:4000/auth/github/callback"
GMAIL_USER="your@gmail.com"
GMAIL_APP_PASSWORD=""
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
FRONTEND_URL="http://localhost:3000"
PORT=4000
NODE_ENV="development"
```

---

## 🌐 Real-time (Socket.IO)

### Chat Gateway
- Namespace: /chat
- joinConversation → join room by conversationId
- sendMessage → save to DB, broadcast to room
- newMessage → received by participants
- typing → broadcast typing indicator

### Notification Gateway
- Namespace: /notifications
- On connect: user joins room by userId
- newNotification → pushed when any service triggers it

---

## 📋 Swagger Setup (main.ts)

```typescript
const config = new DocumentBuilder()
  .setTitle('Job Platform API')
  .setDescription('Cambodia Job Hosting Platform API')
  .setVersion('1.0')
  .addBearerAuth()
  .addTag('auth').addTag('jobs').addTag('applications')
  .addTag('chat').addTag('notifications').addTag('upload').addTag('admin')
  .build();
SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));
```

---

## 🛡️ TypeScript Standards

### TypeScript Rules
- Never use `any` type — it defeats TypeScript's purpose
- Use `unknown` for values with uncertain types, then narrow with type guards
- Use generics for flexible, reusable code
- Define proper `interface` or `type` for all data shapes
- `as any` casting is also forbidden

### Project Config
- `strict: true` and `noImplicitAny: true` are enabled in tsconfig
- ESLint rule `@typescript-eslint/no-explicit-any` is set to `"error"`

## 🏗️ NestJS Architecture Standards

### 1. Mapper Pattern for Prisma → DTO Transformation

Always use a dedicated **Mapper class** to transform Prisma entities into response DTOs.
Never transform data inline inside services or controllers.

**File structure:**
```
src/
└── jobs/
    ├── jobs.controller.ts
    ├── jobs.service.ts
    ├── jobs.mapper.ts
    ├── dto/
    │   ├── create-job.dto.ts
    │   ├── update-job.dto.ts
    │   ├── job-response.dto.ts
    │   └── ...
```

**Mapper pattern:**
```typescript
// jobs.mapper.ts
import { Prisma } from '../../generated/prisma/client';
import { JobResponseDto } from './dto/job-response.dto';

// 1. Define the include shape as const
const jobInclude = {
  company: {
    select: { id: true, name: true, logo: true },
  },
  employer: {
    select: { id: true, email: true },
  },
} as const;

// 2. Derive the type from Prisma using typeof
export type JobWithRelations = Prisma.JobGetPayload<{
  include: typeof jobInclude;
}>;

// 3. Export the include so service can reuse it
export { jobInclude };

// 4. Mapper class with static method
export class JobMapper {
  static toDto(job: JobWithRelations): JobResponseDto {
    return {
      id: job.id,
      title: job.title,
      description: job.description,
      type: job.type,
      category: job.category,
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      deadline: job.deadline,
      isActive: job.isActive,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      company: job.company ? {
        id: job.company.id,
        name: job.company.name,
        logo: job.company.logo,
      } : undefined,
    };
  }
}
```

**Rules:**
- Define `include` shape as `const` in the mapper file.
- Use `Prisma.XxxGetPayload<{ include: typeof xxxInclude }>` for full type safety.
- Export both `xxxInclude` and the `XxxMapper` class from the same file.
- Mapper methods are always `static`.
- Services import `xxxInclude` from the mapper and pass it to Prisma queries.
- Controllers call `XxxMapper.toDto(entity)` or `entities.map(e => XxxMapper.toDto(e))`.

---

### 2. DTO Best Practices

**Required properties** → use `!` (definite assignment assertion)
**Optional properties** → use `?`

```typescript
export class JobResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ required: false })
  salaryMin?: number;
}
```

---

### 3. Controller Best Practices

Always follow this structure for every controller method:

```typescript
// jobs.controller.ts
@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get job by id' })
  @ApiParam({ name: 'id', description: 'Job UUID or CUID' })
  @ApiResponse({ status: 200, type: JobResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async findOne(@Param('id') id: string): Promise<JobResponseDto> {
    const job = await this.jobsService.findOne(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return JobMapper.toDto(job);
  }
}
```

**Controller Rules:**
- Always add `@ApiTags('ModuleName')` on the controller class.
- Always add `@ApiBearerAuth()` on protected routes.
- Always add `@ApiOperation({ summary: '...' })` on every method.
- Always add `@ApiParam` for every route param.
- Always add `@ApiQuery` for every optional query param.
- Always declare all possible `@ApiResponse` statuses (use `ErrorResponseDto` for errors).
- Never return raw Prisma objects — always go through the Mapper.

---

## ✅ Best Practices

### Backend
- Use ConfigService — never process.env directly
- Global ValidationPipe: whitelist: true, forbidNonWhitelisted: true
- All DTOs use class-validator decorators
- Prisma transactions for multi-step DB operations
- Paginate all lists (default page=1, limit=10)
- Consistent response: { data, message, statusCode }
- @ApiTags, @ApiOperation, @ApiBearerAuth on all controllers
- Refresh tokens in httpOnly cookies only
- bcrypt rounds: 12

### Frontend
- All API calls via RTK Query
- Zod schema on all forms
- Never store tokens in localStorage
- middleware.ts for auth protection + locale detection
- All text via useTranslations() — zero hardcoded strings
- Mobile-first Tailwind
- Loading skeletons for async data
- Error boundaries per page

### General
- cuid() for all IDs
- Soft-delete: deletedAt DateTime?
- Shared types in packages/shared
- Git: feat: / fix: / chore: / docs:

---

## 🚀 Getting Started

```bash
pnpm install
npx prisma migrate dev --name init
npx prisma generate
cd apps/api && pnpm dev
cd apps/web && pnpm dev
# Swagger: http://localhost:4000/api/docs
```

---

## 📌 Gemini CLI Rules

When helping with this project, ALWAYS:

1. Respect the folder structure — do not invent new folders
2. Never hardcode UI strings — use i18n message files
3. Add Swagger decorators to every NestJS controller/endpoint
4. Add class-validator decorators to every DTO
5. Use RTK Query for all frontend API calls
6. Suggest a migration name for every Prisma schema change
7. For any new feature, follow this order:
   DB schema → API endpoint → DTO → Service → Controller → Swagger → RTK Query slice → UI component
8. Every new UI feature needs BOTH en.json and km.json translations
9. Ask which role(s) a feature applies to before generating code
10. Validate all inputs, guard all routes, never expose passwords or tokens
11. **Mapper Pattern**: Always use the Mapper pattern (Prisma include const + PayloadType + Mapper class) for Prisma → DTO transformation.
12. **No Inline Transformation**: Never transform Prisma data inline in services or controllers.
13. **DTO Field Assertions**: Use `!` for required fields and `?` for optional fields in all DTOs.
14. **Full Controller Docs**: Ensure every controller method has `@ApiOperation` and `@ApiResponse` for all relevant status codes.