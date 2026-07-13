# English Learning Platform Frontend

The React client for the English Learning Platform. It provides responsive learner and administrator experiences and communicates with the Spring Boot REST API through a shared Axios client.

For complete features, architecture, environment configuration, Docker instructions, and deployment guidance, see the [project README](../README.md).

## Development

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Configure the API URL in `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Commands

```powershell
npm run dev
npm run lint
npm run build
npm run preview
```

## Main Structure

```text
src/
|-- api/          Shared Axios configuration and JWT handling
|-- components/   Reusable UI, layouts, route guards, and feedback states
|-- context/      Authentication state
|-- pages/        Learner and administrator screens
|-- services/     Feature-specific API functions
`-- utils/        Shared helpers
```
