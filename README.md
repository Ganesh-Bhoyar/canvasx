# Real-Time Collaborative Whiteboard

A powerful real-time collaborative whiteboard application built with a modern tech stack, designed for seamless teamwork and creativity.

## � Live Demo

[**Try CanvasX Now**](https://canvasx-ganeshbhoyar.onrender.com/)

## �🚀 Features

- **Real-Time Collaboration**: Multiple users can draw, write, and interact on the same board simultaneously with live updates.
- **Multi-Room Architecture**: Support for distinct rooms, allowing different teams or groups to collaborate privately.
- **Interactive Tools**: Draw shapes (rectangles, circles, etc.), add text, and manipulate objects on the canvas.
- **Persistent Storage**: Board states and user data are securely stored using PostgreSQL.
- **Monorepo Structure**: Efficient code sharing and management between frontend and backend services using Turborepo.

## 🛠️ Tech Stack

This project uses a robust set of technologies to ensure performance, scalability, and developer experience:

- **Frontend**:
  - [Next.js](https://nextjs.org/) - React framework for production.
  - [TypeScript](https://www.typescriptlang.org/) - Static type checking.
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework.
  - [Fabric.js](http://fabricjs.com/) - HTML5 canvas library for interactive object modeling.

- **Backend**:
  - **HTTP Server**: Node.js with Express (located in `apps/http-backend`).
  - **WebSocket Server**: Node.js with `ws` library for real-time communication (located in `apps/ws-backend`).

- **Database**:
  - [PostgreSQL](https://www.postgresql.org/) - Relational database system.
  - [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript.

- **Monorepo Tooling**:
  - [Turborepo](https://turbo.build/) - High-performance build system for JavaScript and TypeScript codebases.
  - [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager and workspace support.

## 📂 Project Structure

The project is organized as a monorepo:

- **`apps/`**: Contains the application source code.
  - `frontend`: The Next.js client application.
  - `http-backend`: The Express.js REST API.
  - `ws-backend`: The WebSocket server for real-time events.
- **`packages/`**: Shared libraries and configurations.
  - `db`: Prisma schema and database client.
  - `common`: Shared types, schemas (Zod), and utility functions.
  - `ui`: Shared UI components.
  - `eslint-config`: Shared ESLint configurations.
  - `typescript-config`: Shared TSConfig files.

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) database running locally or remotely.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd canvasx
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Configuration

1. **Environment Variables**:
   Create `.env` files in the respective application directories (`apps/frontend`, `apps/http-backend`, `apps/ws-backend`, `packages/db`) based on your configuration needs.
   
   Typical variables needed:
   - `DATABASE_URL` (for Prisma in `packages/db`)
   - `JWT_SECRET` (for authentication)

### Database Setup

Initialize the database schema:

```bash
cd packages/db
pnpm dlx prisma generate
pnpm dlx prisma migrate dev
```

### Running the Application

To start all applications (frontend, http-backend, ws-backend) simultaneously in development mode:

```bash
pnpm dev
# or
pnpm turbo dev
```

- **Frontend**: http://localhost:3000
- **HTTP Backend**: http://localhost:3001 (or configured port)
- **WebSocket Server**: ws://localhost:8080 (or configured port)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
