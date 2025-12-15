# 🚀 Collaborative Task Manager

A full-stack, real-time task management application built with **React**, **Node.js**, **TypeScript**, and **Socket.io**. This project demonstrates a production-ready architecture with secure authentication, real-time collaboration, and robust data integrity.

---

## 🏗️ Architecture & Design Decisions

### 1. The Architecture: Controller-Service-Repository (CSR)

We moved away from the standard MVC pattern to a **Layered Architecture** to ensure scalability and testability.

-   **Controllers (Presentation Layer):** Handle HTTP requests/responses and validate input (DTOs). They never touch the database directly.
-   **Services (Business Logic Layer):** Contain the core business rules (e.g., "User cannot delete a task they didn't create", "Password must be hashed").
-   **Repositories (Data Access Layer):** Handle raw database queries. This isolates the DB logic, making it easy to swap databases or mock them for testing.

**Why this choice?**

-   **Testability:** By injecting the _Repository_ into the _Service_, we can easily mock the database logic to write fast Unit Tests (Jest) without spinning up a real DB.
-   **Separation of Concerns:** Business logic remains clean and independent of Express.js or Prisma specifics.

### 2. Data Integrity & Validation (DTOs)

We enforce strict data validation using **Zod** schemas as Data Transfer Objects (DTOs) directly within our Controllers.

-   **Explicit Validation:** Input data (`req.body`) is explicitly parsed against Zod schemas (e.g., `CreateTaskSchema.parse(req.body)`) at the start of every controller method.
-   **Fail-Fast Mechanism:** If the input is invalid (e.g., missing title, weak password), the Zod parser throws an error immediately, which is caught by our global error handler to return a `400 Bad Request`.
-   **Type Safety:** This ensures that only valid, type-safe data is passed down to the Service layer.

### 3. The Database: PostgreSQL + Prisma ORM

We selected **PostgreSQL** managed via **Prisma ORM**.

**Why this choice?**

-   **Relational Integrity:** Task management relies heavily on relationships (Users have many Tasks; Tasks are assigned to Users). A SQL database enforces these constraints better than NoSQL.
-   **Type Safety:** Prisma generates TypeScript types directly from the database schema, ensuring our Backend and Database are always in sync. If a field changes in the DB, the code catches it at compile time.

---

## 🛠️ Tech Stack

### Frontend

-   **Framework:** React (Vite)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **State Management:** Zustand (Auth) + React Query (Server State)
-   **Notifications:** React Hot Toast

### Backend

-   **Runtime:** Node.js + Express
-   **Language:** TypeScript
-   **Database:** PostgreSQL
-   **ORM:** Prisma
-   **Validation:** Zod
-   **Testing:** Jest + Supertest

### Real-Time

-   **Engine:** Socket.io (WebSockets)
-   **Features:** Instant task updates, status changes, and assignment notifications.

---

## ⚙️ Setup Instructions

### Prerequisites

-   Node.js (v18+)
-   PostgreSQL (Local or Cloud URL)

### 1. Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# (Add your DATABASE_URL, JWT_SECRET, and PORT=5000)

# Run Database Migrations
npx prisma migrate dev --name init

# Start the Server
npm run dev
```

### 2. Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Start the React App
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Documentation

### Authentication

-   `POST /api/auth/register` - Create a new account.

-   `POST /api/auth/login` - Login and receive JWT.

-   `POST /api/auth/logout` - Logout the User.

### Tasks

-   `GET /api/tasks` - Fetch all tasks.

-   `POST /api/tasks` - Create a new task.

-   `PUT /api/tasks/:id` - Update task status, priority, or details.

-   `DELETE /api/tasks/:id` - Delete a task (Creator only).

### Users

-   `PUT /api/users/profile` - Update name or password.

-   `GET /api/users` - Get All Users.

## ⚡ Real-Time Features (Socket.io)

The application uses a persistent WebSocket connection to broadcast events instantly.

| Event Name     | Trigger                           | Effect                                           |
| :------------- | :-------------------------------- | :----------------------------------------------- |
| `task:created` | A user creates a new task.        | Task appears on everyone's dashboard instantly.  |
| `task:updated` | Status/Priority/Assignee changed. | Task card moves column or updates color live.    |
| `task:deleted` | A task is removed.                | Task vanishes from the list without page reload. |

**Notification Logic**:

**Assignee Notification**: If a task is assigned to you, you receive a prompt toast: "New task assigned to you!"

**Creator Feedback**: If a task you created is updated (e.g., moved to "Completed"), you receive a notification: "Task 'Design' is marked as Done! 🎉". This keeps creators in the loop automatically.

## 🧪 Testing

We use `Jest` for Unit Testing the Backend Business Logic.

```bash
cd Backend
npm test
```

**Coverage:**

**Validation**: Ensures tasks cannot be created with empty fields.

**Security**: Verifies passwords are never saved as plain text.

**Data Flow**: Confirms the Service layer correctly calls the Repository.
