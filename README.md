# Coworking Space Management System 🏢

A comprehensive, full-stack coworking space management application built with the MERN stack (MongoDB, Express, React, Node.js). This platform allows users to seamlessly browse, book, and manage workspaces and meeting rooms, while providing administrators with a powerful dashboard to manage operations, track revenue, and communicate with members.

## ✨ Features

### For Users
*   **Authentication**: Secure user registration and login.
*   **Desk Booking**: Browse available desks and book them for specific dates.
*   **Meeting Rooms**: View amenities, check availability, and reserve meeting rooms.
*   **User Dashboard**: Track active bookings, booking history, and manage your profile.
*   **Billing & Payments**: View invoices and keep track of payment history.
*   **Community Announcements**: Stay updated with the latest news from the coworking space.

### For Administrators
*   **Admin Dashboard**: Get a real-time overview of statistics, active bookings, and revenue.
*   **Resource Management**: Full CRUD capabilities for Desks and Meeting Rooms (create, edit, delete, toggle availability).
*   **Booking Oversight**: View and manage all user bookings across the platform.
*   **Revenue Tracking**: Monitor financial performance and billing records.

## 🛠️ Tech Stack

**Frontend:**
*   React.js
*   Redux Toolkit (State Management)
*   React Router DOM (Navigation)
*   Axios (API Client)

**Backend:**
*   Node.js & Express.js
*   MongoDB & Mongoose (Database & ORM)
*   JSON Web Token (JWT) for secure authentication
*   Bcryptjs for password hashing

## 🚀 Getting Started

### Prerequisites
*   Node.js (v14 or higher)
*   MongoDB (Local instance or MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/coworking-management.git
    cd coworking-management
    ```

2.  **Setup the Backend:**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory with the following variables:
    ```env
    PORT=5001
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    ```
    *(Optional)* Seed the database with sample data:
    ```bash
    npm run seed
    ```

3.  **Setup the Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

**Run the Backend Server:**
Open a terminal in the `backend` folder and run:
```bash
npm run dev
```

**Run the Frontend Development Server:**
Open another terminal in the `frontend` folder and run:
```bash
npm start
```

The frontend will be available at `http://localhost:3000` and the backend strictly connects at `http://localhost:5001`.

## 🛡️ Admin Access
To create an admin user and access the dashboard:
1.  Navigate to the `backend` folder.
2.  Run the admin creation script:
    ```bash
    npm run create-admin
    ```
3.  Log in through the frontend with the generated admin credentials (default: `admin@coworkspace.com` / `admin123`).

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📜 License
This project is licensed under the MIT License.
