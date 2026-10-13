# Shaheer Naeem Portfolio

A polished portfolio frontend built with Next.js 16 and Tailwind CSS. The existing minimalist portfolio layout is preserved and extended with a cinematic intro, coordinated motion, and a responsive portfolio assistant.

## Run locally

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local` when connecting the separate FastAPI service:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Backend integration

The typed service contract lives in `lib/api.ts` and is ready for:

- `GET /api/v1/profile`
- `GET /api/v1/skills`
- `GET /api/v1/projects`
- `GET /api/v1/projects/{slug}`
- `GET /api/v1/experience`
- `POST /api/v1/contact`
- `POST /api/v1/chat`

The chatbot currently uses clearly labeled mock responses. No AI keys, database credentials, or backend implementation are included in this frontend project.

Download the project as a ZIP from the v0 project menu, or connect it to GitHub for continued development.
