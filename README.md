# English Learning Platform

A full-stack English learning application for primary-school learners, with a focused learner experience and a separate administration area. Learners can study vocabulary by topic, practise with flashcards and quizzes, review mistakes, track progress, and earn achievements. Administrators can manage learning content and monitor platform activity.

## Live Demo

### [Open LinguaPath](https://linguapath-app.vercel.app/)

> The deployed application may need a few seconds to load its first API request if the backend has been inactive.

## Recruiter Snapshot

| Item | Details |
| --- | --- |
| Role | Full-stack Developer |
| Product | English learning platform for primary-school learners |
| Frontend | React 19, Vite 8, Tailwind CSS 4, React Router, Axios |
| Backend | Java 21, Spring Boot 4, Spring Security, Spring Data JPA |
| Data and security | MySQL 8, JWT, BCrypt, USER/ADMIN authorization |
| Scope | 22 React pages, 45 REST endpoints, 15 Spring controllers |
| Deployment | Vercel frontend, Railway backend and MySQL, Docker Compose locally |

Key engineering work:

- Designed and implemented the application across frontend, backend, database, authentication, and deployment.
- Applied layered Spring architecture with controllers, services, repositories, entities, and DTOs.
- Built separate protected experiences for learners and administrators.
- Added production-oriented validation, loading, empty, success, and error states.
- Configured environment-based deployment without hard-coding production API credentials or URLs.

## Highlights

- Secure registration and login with JWT authentication and BCrypt password hashing
- Role-based authorization for `USER` and `ADMIN`
- Topic-based vocabulary learning with search, pagination, favourites, and pronunciation
- Flashcards, topic quizzes, result history, and wrong-answer review
- XP, levels, daily streaks, achievements, rankings, and learning analytics
- Free and premium access rules with mock checkout and payment history
- Admin dashboard, platform statistics, topic moderation, and content management
- Responsive React interface with protected layouts, loading states, empty states, validation, and error feedback
- Docker Compose setup for running the complete stack locally

> The payment flow is a portfolio demonstration. It does not process real payments.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite 8, React Router, Axios, Tailwind CSS 4, Lucide React |
| Backend | Java 21, Spring Boot 4, Spring Security, Spring Data JPA, Bean Validation |
| Authentication | JWT, BCrypt, USER/ADMIN role-based access control |
| Database | MySQL 8 |
| API documentation | Springdoc OpenAPI, Swagger UI |
| Tooling | Maven, npm, ESLint, Docker, Docker Compose, Git |

## Core Features

### Learner

- Create an account, sign in, update a profile, and maintain an authenticated session
- Browse public learning topics and access content according to the assigned plan
- Search vocabulary, study flashcards, hear browser-based pronunciation, and save favourites
- Complete quizzes generated from topic vocabulary and review previous results
- Revisit incorrect answers and monitor vocabulary progress
- Track XP, level, streak, achievements, ranking, and personal analytics

### Administrator

- View user, content, subscription, and learning-activity statistics
- Create, update, moderate, and remove learning topics
- Manage topic visibility, access type, and approval status
- Manage vocabulary through the existing topic workflow
- Access protected administration routes available only to `ADMIN`

## Architecture

```text
React + Vite frontend
        |
        | Axios / JSON / JWT
        v
Spring Boot REST API
Controller -> Service -> Repository -> Entity/DTO
        |
        v
      MySQL
```

The frontend follows this flow:

```text
Pages -> Reusable components -> API services -> Axios client
```

The detailed architecture diagram is available at `docs/system-architecture-diagram.html`.

## Repository Structure

```text
english-learning-app/
|-- backend/                 Spring Boot REST API
|   |-- src/main/java/       Controllers, services, repositories, entities, DTOs
|   |-- src/main/resources/  Local and production configuration
|   `-- Dockerfile
|-- frontend/                React and Vite client
|   |-- src/api/             Shared Axios client
|   |-- src/components/      Reusable UI and route guards
|   |-- src/context/         Authentication state
|   |-- src/pages/           Learner and administrator pages
|   |-- src/services/        Feature-specific API calls
|   `-- Dockerfile
|-- docs/                    Architecture documentation
|-- docker-compose.yml       Local full-stack environment
`-- README.md
```

## Getting Started

### Prerequisites

- Java 21
- Node.js 22 or later
- MySQL 8, or Docker Desktop
- Git

### Option 1: Docker Compose

From the repository root:

```bash
docker compose up --build
```

Services are available at:

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:8080` |
| Swagger UI | `http://localhost:8080/swagger-ui/index.html` |
| MySQL | `localhost:3306` |

Stop the stack with:

```bash
docker compose down
```

Use `docker compose down -v` only when you intentionally want to delete the local database volume.

### Option 2: Run Services Manually

Create a MySQL database:

```sql
CREATE DATABASE english_learning_db;
```

Start the backend on Windows:

```powershell
cd backend
$env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/english_learning_db"
$env:SPRING_DATASOURCE_USERNAME="root"
$env:SPRING_DATASOURCE_PASSWORD="your-local-password"
$env:JWT_SECRET="replace-with-a-strong-32-plus-character-local-secret"
.\mvnw.cmd spring-boot:run
```

The Spring application reads environment variables from the process. Use `backend/.env.example` as the variable reference for your IDE, terminal, or deployment platform; Spring Boot does not load that file automatically.

Start the frontend in another terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

## Environment Variables

### Backend

| Variable | Purpose |
| --- | --- |
| `SPRING_PROFILES_ACTIVE` | Selects `local` or `prod` configuration |
| `SPRING_DATASOURCE_URL` | MySQL JDBC connection URL |
| `SPRING_DATASOURCE_USERNAME` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | Database password |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Hibernate schema strategy |
| `JWT_SECRET` | Secret used to sign JWTs; use a strong production value |
| `JWT_EXPIRATION_MS` | Token lifetime in milliseconds |
| `APP_CORS_ALLOWED_ORIGINS` | Comma-separated permitted frontend origins |
| `SWAGGER_ENABLED` | Enables or disables production API documentation |

### Frontend

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Public base URL of the Spring Boot API |

Never commit real database passwords, JWT secrets, or production `.env` files.

## API and Authorization

The backend exposes 45 REST endpoints across authentication, users, topics, vocabulary, quizzes, progress, favourites, achievements, ranking, subscriptions, payments, analytics, and administration.

- Authentication endpoints are publicly accessible.
- Learner endpoints require a valid bearer token.
- `/api/admin/**` requires the `ADMIN` role.
- New registrations receive the `USER` role by default.

During local development, explore the API at:

```text
http://localhost:8080/swagger-ui/index.html
```

## Verification

Run backend tests and package the application:

```powershell
cd backend
.\mvnw.cmd test
.\mvnw.cmd clean package
```

Lint and build the frontend:

```powershell
cd frontend
npm run lint
npm run build
```

## Deployment

The repository supports deploying the frontend and backend independently:

1. Provision a production MySQL database.
2. Deploy `backend/` to a Java- or Docker-compatible platform such as Railway.
3. Set the production Spring profile, database credentials, JWT secret, and allowed frontend origin.
4. Deploy `frontend/` to Vercel with `VITE_API_BASE_URL` pointing to the backend domain.
5. Update `APP_CORS_ALLOWED_ORIGINS` with the final Vercel or custom domain.
6. Import learning topics and vocabulary into the production database.

The included `frontend/vercel.json` provides SPA fallback routing, while both applications include Dockerfiles for container deployment.

## Author

**Nguyen Dinh Thai**

- GitHub: [github.com/chocolinho](https://github.com/chocolinho)
- Email: [nguyendinhthai943@gmail.com](mailto:nguyendinhthai943@gmail.com)
