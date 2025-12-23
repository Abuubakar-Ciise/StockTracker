# Stock Tracker Dashboard

Frontend dashboard for the Stock Tracker application built with React, TypeScript, Vite, and Tailwind CSS.

## Prerequisites

- Node.js 18+
- npm or yarn

## Environment Variables

Create a `.env` file in the dashboard root directory:

```env
VITE_API_URL=https://your-server-domain.com/api
```

For local development:
```env
VITE_API_URL=http://localhost:3000/api
```

**Important:** Environment variables must be prefixed with `VITE_` to be accessible in the application.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The dashboard will start on `http://localhost:5173` (default Vite port)

## Production Build

```bash
npm run build
```

The production build will be generated in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to the dashboard directory
3. Run `vercel` and follow the prompts
4. Set environment variable `VITE_API_URL` in Vercel dashboard to point to your deployed server API
5. The build command and output directory are automatically detected by Vercel

**Note:** For automatic deployments, connect your repository to Vercel. Make sure to set the environment variable for each environment (production, preview, development).

### Render

1. Create a new Static Site on Render
2. Connect your repository
3. Set the root directory to `dashboard`
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Add environment variable `VITE_API_URL` in the Render dashboard pointing to your deployed server API

**Important:** 
- Set `VITE_API_URL` to your deployed server URL (e.g., `https://your-server.onrender.com/api`)
- The API URL is embedded at build time, so you need to rebuild if you change it
- For Render static sites, you'll need to trigger a new build to update environment variables

## Project Structure

```
dashboard/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── services/       # API service functions
│   ├── store/          # Zustand state management
│   └── views/          # View components
├── public/             # Static assets
└── dist/               # Production build output
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

- Product management (CRUD operations)
- Stock analytics and reporting
- Real-time dashboard with charts
- Authentication integration
- Responsive design
