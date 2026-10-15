# Influencer Performance Tracker

A React dashboard for managing influencer profiles and campaigns, viewing performance analytics, and organizing brand activity.

## Features

- Dashboard with influencer and campaign summaries
- Influencer directory and profile details
- Campaign management
- Analytics and reports
- Brand, message, and notification pages
- Light/dark theme toggle
- Demo sign-in flow

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Chart.js and `react-chartjs-2`

## Getting started

### Prerequisites

- Node.js (use a current LTS release)
- npm

### Install and run

From the project directory:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your browser.

### Build for production

```bash
npm run build
npm run preview
```

## Demo and data

This project currently uses mock authentication and sample influencer/campaign data. Influencer and campaign changes are stored in the browser's `localStorage`; they are not shared with other users or devices. The backend integration points are not enabled by default.

The demo login is currently implemented in `AuthContext.tsx`. Check that file for the demo sign-in behavior. This is not production authentication; connect a secure backend before using the app with real accounts or data.

## Project structure

All application source, static assets, and project configuration files are stored directly in this directory (no nested folders). Original path components are incorporated into filenames when needed to prevent collisions.

## Environment configuration

An optional `VITE_API_BASE_URL` setting is referenced for backend integration. Backend calls and backend authentication are disabled in the current demo. Do not commit `.env` files or credentials; configure secrets through your deployment platform.
