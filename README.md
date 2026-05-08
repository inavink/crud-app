# CRUD App with 3-Tier Architecture

This workspace contains a full-stack CRUD application with:
- Frontend: React + Vite
- Backend: Express + Node.js
- Database: MySQL

## Features
- User registration and login
- JWT-based authentication
- CRUD operations on user-specific items
- Admin panel to manage all users and items

## Admin Panel

An admin can:
- View all users and items in the system
- Delete users and items
- Change user roles (user ↔ admin)
- Access the admin panel from the dashboard if they have admin privileges

### Setting up an admin user

1. Register a new user via the frontend
2. Use MySQL to promote the user to admin:
   ```sql
   UPDATE users SET role = 'admin' WHERE username = 'your_username';
   ```
3. Log in with the admin account and you'll see an "Admin Panel" button on the dashboard

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

> If you run the frontend on a public EC2 host, expose the Vite server on `0.0.0.0` and set the backend base URL to your EC2 public IP.
>
> Example:
> ```bash
> export VITE_BACKEND_URL=http://<EC2_PUBLIC_IP>:4000/api
> npm run dev
> ```
>
> Then open `http://<EC2_PUBLIC_IP>:5173` in your browser.

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
