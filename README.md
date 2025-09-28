# Expense Tracker

A comprehensive personal finance and expense tracking application with separate frontend and backend components.

## Project Structure

- `/api` - Backend API built with Node.js, Express, TypeScript, and Prisma
- `/client` - Frontend application built with Vue 3, Vite, and Tailwind CSS

## Features

- User authentication and account management
- Financial accounts tracking
- Income and expense recording
- Transaction categorization
- Transfer between accounts
- Reporting and data visualization
- Mobile-first responsive design

## Getting Started

### Prerequisites

Before running the application locally, you need to configure the connection between frontend and backend:

1. **Configure CORS in Backend:**

   - Navigate to `/api/src/index.ts`
   - Update the CORS origin to allow your local frontend:

   ```typescript
   app.use(
     cors({
       origin: 'http://localhost:5173', // or your local frontend port
       credentials: true,
     })
   );
   ```

2. **Configure API Base URL in Frontend:**
   - Navigate to `/client/src/services/api.ts`
   - Update the baseURL to point to your local backend:
   ```typescript
   const api = axios.create({
     baseURL: 'http://localhost:3000/api', // or your local backend port
     timeout: 10000,
   });
   ```

### Backend Setup

1. Navigate to the API directory:

   ```bash
   cd api
   ```

2. Follow the instructions in the [API README](./api/README.md)

### Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Follow the instructions in the [Client README](./client/README.md)

## Development

For local development, you'll need to run both the backend and frontend:

1. **Start the backend** (from `/api` directory):

   ```bash
   npm run dev
   ```

   The API will typically run on `http://localhost:3000`

2. **Start the frontend** (from `/client` directory):
   ```bash
   npm run dev
   ```
   The client will typically run on `http://localhost:5173`

> **Note:** Make sure the ports in your CORS configuration and API baseURL match the actual ports your applications are running on.

## Tech Stack

- **Frontend**: Vue 3, Vite, Tailwind CSS, Pinia
- **Backend**: Node.js, Express, TypeScript, Prisma
- **Database**: MySQL

## Configuration Notes

- For production deployment, make sure to update the CORS origin and API baseURL to match your production domains
- Environment variables should be used for different environments (development, staging, production)
