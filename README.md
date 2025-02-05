# Task Manager

A simple task management application with Next.js for the frontend and Express.js and Node.js for the backend. This app allows users to register, log in, create, view, edit, delete, and categorize tasks (To Do, In Progress, Completed, Urgent, Weekly, Monthly). It supports user authentication and session management, data persistence through MongoDB, and error handling.

## Table of Contents

- [Features](#features)
- [Tech-Stack-Used](#tech-stack-used)
- [Installation](#installation)
- [Contributing](#contributing)

## Features

**User Authentication:**

- User Registration
- User Login
- User Logout

**Task Operations:**

- Create, view, edit, and delete tasks
- Categorize tasks (To Do, In Progress, Completed, Urgent, Weekly, Monthly)
- Mark tasks as complete or incomplete

**Task Details:**

- Title, description, due date
- Data Persistence:
  MongoDB for storing tasks and user information
- Error Handling & Loading States:
  Proper error handling and user-friendly loading states
- Frontend:
  Next.js (for SSR/SSG support)
- Backend:
  Express.js & Node.js (for task and authentication APIs)

## Tech-Stack-Used

**Frontend**

Next.js (latest version)
Tailwind CSS (for styling)
React (for building components)

**Backend**

Express.js (for API routes)
Node.js (for server-side logic)
MongoDB (for data persistence)
JWT (for user authentication)

**Deployment**

Deployment: Vercel

## Installation

To run this project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Piyush0924/Task-Manager.git
   ```

2. **Install backend dependencies:**

   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies:**

   ```bash
   cd client
   npm install
   ```

4. **Set up environment variables for the backend:**

   Create a `.env` file in the `backend` directory with the following content:

   ```env
   MONGO_URI=''
   PORT=5000
   JWT_SECRET = ''

   ```

5. **Run the backend server:**

   ```bash
   cd server
   npm run start
   ```

6. **Run the frontend server:**
   ```bash
   cd client
   npm run dev
   ```
7. **Set up environment variables for frontend:**

   Create a `.env.local` file in the `frontend` directory with the following content:

   ```env
   NEXT_PUBLIC_BASE_URL='http://localhost:5000'
   ```

The application should now be running on `http://localhost:5173/`.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request.

## Thank You

**Keep Coding Have a Optimistic View**
