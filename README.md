# StockTracker

A full-stack stock tracking application with React dashboard and Node.js backend.

**Live Demo:** [stock-tracker1.vercel.app/](https://stock-tracker1.vercel.app/)

## Screenshots

![Dashboard](screenshots/image1.png)

![Products](screenshots/image.png)

## Installation & Setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v12+)
- npm

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in `server` directory:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/stocktracker?schema=public"
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:5173
```

4. Generate Prisma Client:
```bash
npx prisma generate
```

5. Start the server:
```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Frontend Setup

1. Navigate to dashboard directory:
```bash
cd dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Dashboard runs on `http://localhost:5173`

## Running the Project

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd dashboard
npm run dev
```

## Tech Stack

# Frontend: React + Vite + TypeScript

I chose React with Vite for the frontend to ensure a fast, modern development experience. Vite's Hot Module Replacement (HMR) allows for rapid UI iterations. TypeScript was used to provide type safety, reducing bugs and improving code maintainability

# Backend: Node.js + Express + PostgreSQL (Prisma)

The backend is built with Node.js and Express for a scalable REST API.

Prisma ORM: I chose Prisma to interact with the PostgreSQL database because of its powerful schema modeling and type-safe client, making it easy to manage product data (Name, Description, Price, Image, and Quantity)

# Deployment & CI/CD
Frontend: Deployed to Vercel.
Backend: Deployed to Render.
GitHub Actions: Integrated a build pipeline to automate testing and deployment for a seamless CI/CD process.

