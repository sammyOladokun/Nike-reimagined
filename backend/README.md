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

### Production values

If you deploy this backend to Render and the frontend to Vercel, use values like these:

```bash
NODE_ENV=production
PORT=10000
CLIENT_URL=https://your-frontend.vercel.app
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
JWT_SECRET=generate-a-long-random-secret
JWT_EXPIRES_IN=7d
```

Render expects the server to listen on `0.0.0.0` and use the platform `PORT`.
