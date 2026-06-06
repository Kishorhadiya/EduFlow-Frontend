### **Project Prompt: Student EduFlow Management (MERN Stack)**

**Objective:**
Build a full-stack **Student EduFlow Management** using the **MERN Stack** (MongoDB, Express.js, React, Node.js). The application should have two distinct roles: **Teacher** and **Student**, with role-based access control (RBAC).

**Tech Stack:**
*   **Frontend:** React (Vite), Tailwind CSS **v4**, React Router DOM, Context API (for Auth).
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB (Mongoose).
*   **Authentication:** JWT (JSON Web Tokens) with `bcryptjs` for password hashing.
*   **Styling:** Modern, clean UI using Tailwind CSS.

**Core Architecture:**
*   **Backend:** Use a strict **MVC** (Model-View-Controller) structure. Separate `routes`, `controllers`, and `models`.
*   **Frontend:** Centralize API base URL in a `.env` file (`VITE_API_URL`). Use a `PrivateRoute` component to handle role-based protection.

---

### **Detailed Feature Requirements**

#### **1. Authentication & Profile**
*   **Register/Login:** Users can register as either a **Teacher** or **Student**.
    *   **Student Registration:** Must select a "Class" from a dropdown of available classes during registration.
*   **Profile Management:**
    *   Users can update their Name and Email.
    *   Users can Change Password.
*   **Navigation:**
    *   Dynamic Navbar based on role.
    *   Show logged-in user's name and role on the right side, followed by a **Logout** button.
    *   Profile link should be clickable on the username.

#### **2. Teacher Module**
*   **Dashboard:** Quick links to Manage Classes, Manage Assignments, and View Submissions.
*   **Class Management:**
    *   **List Classes:** View all classes.
    *   **Create Class:** Add new classes (Name, Department).
    *   **Update/Delete Class:** Teachers can edit or delete classes.
    *   **Deletion Validation:** *Prevent deletion if students are already registered to that class.*
*   **Assignment Management (Separated Pages):**
    *   **List Assignments:** View all assignments **created by the logged-in teacher**.
        *   Include a "Filter by Class" dropdown locally.
        *   Show Class Name on each assignment card.
    *   **Create Assignment:** Dedicated page to create a new assignment (Title, Desc, Due Date, Select Class).
    *   **Edit Assignment:** Dedicated page to update an existing assignment.
    *   **Delete Assignment:** Validate deletion: *Prevent deletion if any student has already submitted work.*
*   **Grading & Submissions:**
    *   Select a Class -> Select an Assignment -> View List of Submissions.
    *   **Evaluation:** Enter Marks and Feedback for each submission.
    *   **Marks Validation:** *Ensure marks cannot exceed 100* (Validate on both Frontend and Backend).

#### **3. Student Module**
*   **Dashboard:** View all assignments assigned to their registered class.
    *   Show status: **Pending**, **Submitted**, or **Reviewed**.
*   **Submit Assignment:**
    *   If status is "Pending", allow student to submit a link (e.g., Drive/GitHub).
*   **My Submissions:**
    *   View history of all submissions with Status, Link, Marks, and Feedback.
    *   **Delete Submission:** Students can delete their submission if needed (resetting status to Pending).

---

### **Technical Implementation Details**

**Backend Routes & Controllers:**
*   `authRoutes`: Register, Login, Update Profile, Change Password.
*   `classRoutes`: CRUD operations for classes.
*   `assignmentRoutes`:
    *   CRUD operations.
    *   `GET /created-by-me`: Fetch assignments created by the current teacher.
*   `submissionRoutes`: Submit, View by Assignment, View by Student, Evaluate, Delete.

**Database Models:**
*   **User**: `name`, `email`, `password`, `role` (enum: 'teacher', 'student'), `classId` (ref: Class, required if student).
*   **Class**: `title`, `department`.
*   **Assignment**: `title`, `description`, `dueDate`, `classId` (ref: Class), `createdBy` (ref: User/Teacher).
*   **Submission**: `assignmentId`, `studentId`, `submissionLink`, `status` (enum: 'pending', 'submitted', 'reviewed'), `marks`, `feedback`.

**Frontend UI/UX:**
*   Use a professional layout with a responsive Navbar.
*   Use Tailwind CSS v4 for all styling (configure using `@tailwindcss/vite`).
*   Show alerts/notifications for success and error states.
*   Clicking the username in Navbar should redirect to the Profile page.
