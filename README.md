# Student EduFlow Management (MERN Stack)

A full-stack EduFlow Management built with the MERN stack (MongoDB, Express.js, React, Node.js).
This application allows Teachers to manage classes, create assignments, and grade submissions, while Students can submit their work and view their grades.

## Features

- **Authentication**: Role-based login/registration (Teacher/Student).
- **Teacher Module**:
  - Manage Classes (Create, Update, Delete).
  - Manage Assignments (Create, Edit, Delete, Filter by Class).
  - View & Grade Submissions.
- **Student Module**:
  - View Assignments.
  - Submit Assignments (Link submission).
  - View My Submissions (Status, Marks, Feedback).
  - Delete Submissions (if needed).
- **Profile**: Update profile and change password.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v4, React Router DOM.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or cloud URI)

## Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd assignment-management-system
    ```

2.  **Install Dependencies**:

    *   **Server**:
        ```bash
        cd server
        npm install
        ```
    *   **Client**:
        ```bash
        cd ../client
        npm install
        ```

3.  **Configuration**:

    *   **Server**: Create a `.env` file in the `server` directory:
        ```env
        PORT=5000
        MONGO_URI=mongodb://localhost:27017/assignment-system
        JWT_SECRET=your_jwt_secret_key
        ```
    *   **Client**: Create a `.env` file in the `client` directory:
        ```env
        VITE_API_URL=http://localhost:5000/api
        ```

## Running the Application

1.  **Start the Backend**:
    ```bash
    cd server
    npm run dev  # Runs with nodemon
    # OR
    npm start    # Runs with node
    ```

2.  **Start the Frontend**:
    ```bash
    cd client
    npm run dev
    ```

The application will be available at `http://localhost:5173`.
The server API will run at `http://localhost:5000`.

## Project Structure

- `client/`: React Frontend application.
- `server/`: Node.js/Express Backend API.

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set root directory to `client`
3. Add environment variable: `VITE_API_URL` (your backend URL)
4. Deploy

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set root directory to `server`
3. Add environment variables:
   - `PORT` (default: 5000)
   - `MONGO_URI` (your MongoDB connection string)
   - `JWT_SECRET` (your JWT secret key)
4. Deploy

## Environment Variables

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Server (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/assignment-system
JWT_SECRET=your_jwt_secret_key
```

## Production Notes

- The frontend uses Vite with React Router for SPA routing
- Vercel configuration handles SPA rewrites via vercel.json
- All API calls include fallback to localhost for development
- Mobile-responsive design with Tailwind CSS v4
- Role-based authentication with JWT tokens
