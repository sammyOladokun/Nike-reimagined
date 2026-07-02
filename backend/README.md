# Nike Reimagined Backend

Express API scaffold for the portfolio version of the store.

## What’s here
- Health check route
- Auth routes with JWT cookies
- Prisma schema for PostgreSQL
- User repository backed by Postgres
- Security middleware for headers and rate limiting

## Run
```bash
cd backend
npm install
npm run prisma:generate
npm run dev
```

## Environment
Copy `.env.example` to `.env` and update the database password before running locally.
