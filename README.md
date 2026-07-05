# English Learning Platform

Fullstack English learning platform inspired by Duolingo/Lingokids.

## Tech Stack

- Backend: Java 21, Spring Boot, Spring Security, JWT, Spring Data JPA, MySQL
- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Context API
- Tooling: Docker, Swagger/OpenAPI

## Current Features

- JWT login/register
- Protected user routes and ADMIN-only routes
- User dashboard with XP, level, streak and learning stats
- Topic and vocabulary CRUD
- Public/private/free/premium topic access
- Flashcard learning with pronunciation
- Quiz practice by topic with XP/level updates
- Quiz result history
- Favorite vocabulary
- Review wrong answers
- Achievement system
- Ranking
- Profile page
- Premium feature gates and mock checkout
- Payment history
- Admin dashboard, analytics and topic moderation

## Architecture

Backend follows:

```text
Controller -> Service -> Repository -> Entity -> DTO
```

Frontend follows:

```text
Pages -> Components -> Services -> Axios API
```

Architecture diagram:

```text
docs/system-architecture-diagram.html
```

## Local Development

Backend:

```bash
cd backend
cmd /c mvnw.cmd test
cmd /c mvnw.cmd spring-boot:run
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Docker Compose:

```bash
docker compose up --build
```

## Environment Variables

Backend example:

```text
backend/.env.example
```

Frontend example:

```text
frontend/.env.example
```

Production backend should run with:

```text
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=...
SPRING_DATASOURCE_USERNAME=...
SPRING_DATASOURCE_PASSWORD=...
JWT_SECRET=...
APP_CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

Production frontend should run with:

```text
VITE_API_BASE_URL=https://your-backend-url
```

## Deployment Notes

- Deploy frontend on Vercel from the `frontend` directory.
- Deploy backend on Render, Railway or another Java-friendly platform.
- Use MySQL cloud database for production.
- Set backend CORS to the deployed Vercel domain.
- Set `VITE_API_BASE_URL` in Vercel to the deployed backend URL.

## Live Demo

Backend:

```text
https://english-learning-app-backend-axuv.onrender.com
```

Swagger:

```text
https://english-learning-app-backend-axuv.onrender.com/swagger-ui/index.html
```

## Verification

```bash
cd backend
cmd /c mvnw.cmd test

cd ../frontend
npm run lint
npm run build
```
