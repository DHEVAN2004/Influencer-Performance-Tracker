# Influencer Performance Tracker

A full-stack project for managing influencer profiles and campaigns, with analytics dashboards.

## Project structure

- `Full Stack & DM Mini-Proj/influencer-performance-tracker` — React, TypeScript, and Vite frontend.
- `Full Stack & DM Mini-Proj/influencer-backend` — Spring Boot REST API with MySQL and JWT support.

## Requirements

- Node.js and npm
- Java 17 and Maven
- MySQL, if running the backend

## Run the frontend

From the repository root:

```powershell
cd "Full Stack & DM Mini-Proj\influencer-performance-tracker"
npm install
npm run dev
```

Vite prints the local URL when the development server starts.

The frontend currently uses mock data by default. Backend API and authentication integration are disabled in the frontend configuration.

## Run the backend

The backend expects a MySQL database named `influencer_db` on `localhost:3306` and uses the `root` database user by default. Set the database password and JWT signing secret in the environment before starting it:

```powershell
$env:DB_PASSWORD = "your-database-password"
$env:JWT_SECRET = "your-long-random-secret"
cd "Full Stack & DM Mini-Proj\influencer-backend"
mvn spring-boot:run
```

The API starts on port `8080` by default. Do not commit real passwords or signing secrets.
