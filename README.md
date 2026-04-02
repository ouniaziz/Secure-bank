# SecureBank Monorepo

Full-stack banking application with:

- `backend/`: NestJS + TypeORM + MySQL API
- `frontend/`: Next.js application

## Project Structure

- `backend/` - API, auth, transfers, beneficiaries, transactions
- `frontend/` - UI pages, components, API client

## Prerequisites

- Node.js 18+
- npm 9+
- MySQL 8+

## Quick Start

### 1) Backend setup

```bash
cd backend
npm install
```

Configure backend environment variables (create `.env` in `backend/` with your values), then run:

```bash
npm run start:dev
```

Backend default URL is typically:

- `http://localhost:3000`

### 2) Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL is typically:

- `http://localhost:3001` or `http://localhost:3000` (depending on availability)

## Useful Backend Commands

```bash
cd backend
npm run build
npm run migration:run
npm run migration:generate
npm run migration:revert
npm run db:seed
```

## Useful Frontend Commands

```bash
cd frontend
npm run build
npm run start
npm run lint
```

## Git Notes

- Root `.gitignore` excludes generated artifacts such as `node_modules/` and `frontend/.next/`.
- Repository remote: `https://github.com/ouniaziz/Secure-bank.git`

## Existing Backend Documentation

For API-specific details, endpoints, and security notes, see:

- `backend/README.md`
