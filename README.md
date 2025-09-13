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

### Backend Setup

1. Navigate to the API directory:

   ```
   cd api
   ```

2. Follow the instructions in the [API README](./api/README.md)

### Frontend Setup

1. Navigate to the client directory:

   ```
   cd client
   ```

2. Follow the instructions in the [Client README](./client/README.md)

## Development

For local development, you'll need to run both the backend and frontend:

1. Start the backend (from `/api` directory):

   ```
   npm start
   ```

2. Start the frontend (from `/client` directory):
   ```
   npm run dev
   ```

## Tech Stack

- **Frontend**: Vue 3, Vite, Tailwind CSS, Pinia
- **Backend**: Node.js, Express, TypeScript, Prisma
- **Database**: MySQL
