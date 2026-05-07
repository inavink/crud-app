# CRUD App with 3-Tier Architecture

This workspace contains a full-stack CRUD application with:
- Frontend: React + Vite
- Backend: Express + Node.js
- Database: MySQL

## Features
- User registration and login
- JWT-based authentication
- CRUD operations on user-specific items

## Setup

### 1. Start MySQL
Create a MySQL database named `crud_app` and a user with access, or use the example values below.

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env if needed
npm start
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Default Environment
Use the following database connection values in `backend/.env`:

```env
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=crud_app
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=1h
```

## Notes
- The backend automatically creates required tables on first run.
- Use the login/register form in the frontend to create users and manage items.
