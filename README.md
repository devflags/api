# DevFlags API

The backend for DevFlags, a side project for teams building feature-flag-driven TypeScript systems.

The API is intended to give teams a central place to create projects, define environments, manage feature flags, and eventually serve flag evaluations through the DevFlags SDK.

## Current status

This project is a work in progress and is **not production-ready**. The API currently contains the initial NestJS modules for authentication, organizations, projects, environments, and feature flags. The public SDK contract, flag evaluation flow, permissions, validation, and operational concerns still need more work.

Progress is intermittent because this is a side project built alongside school and work. Expect breaking changes while the data model and API contract are still evolving.

## Technology

- [NestJS](https://nestjs.com/) and TypeScript
- [Better Auth](https://www.better-auth.com/) for authentication and organizations
- [Prisma](https://www.prisma.io/) with PostgreSQL
- Jest and Supertest for testing

## Project structure

- `src/auth` - authentication configuration and user-facing auth routes
- `src/projects` - project management
- `src/environment` - project environments
- `src/flags` - feature flag creation and retrieval
- `src/database` - Prisma client and database integration
- `prisma` - database schema and migrations

## Local setup

From this directory, install dependencies:

```bash
pnpm install
```

Create a local environment file with the database and authentication settings required by the application. The exact environment contract is still being consolidated, so check the source configuration and auth setup before starting a new deployment.

Run the API in development mode:

```bash
pnpm run start:dev
```

The API uses PostgreSQL through Prisma. Apply the local database migrations with the Prisma workflow configured for this repository before using project, environment, or flag endpoints.

## Useful commands

```bash
pnpm run build       # Build the API
pnpm run lint        # Lint and fix TypeScript files
pnpm run test        # Run unit tests
pnpm run test:e2e    # Run end-to-end tests
pnpm run test:cov    # Generate test coverage
```

## Planned work

- Stabilize the API and authentication contract
- Complete environment-specific flag values and targeting rules
- Define secure SDK authentication and flag evaluation endpoints
- Add audit history, stronger validation, and broader test coverage
- Document deployment and production configuration

## Note

DevFlags is currently an experimental learning project rather than a finished service. The code is published to document the direction of the platform and its progress.
