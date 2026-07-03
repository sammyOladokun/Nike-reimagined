## Nike Reimagined 🏃‍♂️👟

A sleek and modern **Nike** website redesign built with ⚛️ **React** and 🎨 **Tailwind CSS**.  
This project showcases a fully **responsive** design, smooth ✨ animations, and a clean UI inspired by Nike’s iconic branding.  
Deployed on ▲ **Vercel** for lightning-fast performance 🚀.

---

## Tech Stack
- **React** – Frontend library  
- **Tailwind CSS** – Styling framework  
- **Vite** – Development and build tool  
- **Vercel** – Deployment platform  
- **Express** – Backend API scaffold in `backend/`

---

## Installation

```bash
git clone https://github.com/adityadomle/nike-reimagined.git
cd nike-reimagined
npm install
```

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

---

## Production Deployment

Recommended setup:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Neon PostgreSQL

### Frontend env on Vercel

Set:

```bash
VITE_API_URL=https://your-backend.onrender.com
```

### Backend env on Render

Set:

```bash
NODE_ENV=production
PORT=10000
CLIENT_URL=https://your-frontend.vercel.app
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
JWT_SECRET=generate-a-long-random-secret
JWT_EXPIRES_IN=7d
```

### Neon database

Use the Neon connection string in `DATABASE_URL`. Make sure SSL is enabled:

```bash
postgresql://USER:PASSWORD@HOST/DB?sslmode=require
```

### Deploy order

1. Create the Neon database
2. Deploy the backend to Render
3. Set `VITE_API_URL` on Vercel
4. Deploy the frontend to Vercel
5. Test sign up, sign in, cart, and checkout end to end

### Vercel routing

The root `vercel.json` keeps React Router working on page refreshes by rewriting
all non-asset routes to `index.html`.
