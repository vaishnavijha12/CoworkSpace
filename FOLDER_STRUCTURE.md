# Vaishnavi Coworking Space - Folder Structure

## Overview
This is a full-stack MERN application  for managing coworking spaces, desks, and meeting rooms.

## Directory Structure

```
vaishnavi2/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB configuration
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth logic (register, login, profile)
│   │   │   ├── deskController.js    # Desk CRUD operations
│   │   │   └── roomController.js    # Meeting room CRUD operations
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT authentication middleware
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Desk.js
│   │   │   ├── DeskBooking.js
│   │   │   ├── MeetingRoom.js
│   │   │   ├── RoomBooking.js
│   │   │   ├── Announcement.js
│   │   │   └── Billing.js
│   │   ├── routes/
│   │   │   └── auth.js              # Authentication routes
│   │   ├── utils/
│   │   │   └── jwtGenerator.js      # JWT token generation
│   │   └── server.js                # Express server entry point
│   ├── package.json
│   └── package-lock.json
│
└── frontend/
    ├── public/
    │   ├── index.html
    │   ├── favicon.ico
    │   ├── manifest.json
    │   └── robots.txt
    ├── src/
    │   ├── App.js                   # Main app component
    │   ├── App.css                  # Main app styles
    │   ├── index.js                 # React DOM entry point
    │   ├── index.css                # Global styles
    │   ├── reportWebVitals.js       # Web vitals reporting
    │   ├── setupTests.js            # Test setup
    │   ├── app/
    │   │   └── store.js             # Redux store configuration
    │   ├── assets/                  # Images, icons, etc.
    │   ├── components/
    │   │   └── Layout.js            # Main layout wrapper
    │   ├── features/
    │   │   └── auth/
    │   │       └── authSlice.js     # Redux auth slice
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── Desks.js
    │   │   ├── MeetingRooms.js
    │   │   ├── Announcements.js
    │   │   ├── Bookings.js
    │   │   ├── Billing.js
    │   │   └── Profile.js
    │   ├── services/
    │   │   └── api.js               # API client (Axios)
    │   └── styles/                  # Additional stylesheets
    ├── package.json
    ├── package-lock.json
    └── README.md
```

## Changes Made

### Fixed Issues:
1. ✅ **Removed nested frontend folder** - Was causing confusion with duplicate structure
2. ✅ **Added missing React entry files** - Added `index.js`, `App.js`, and CSS files
3. ✅ **Created backend controllers** - Added authController, deskController, and roomController
4. ✅ **Verified folder hierarchy** - All folders now properly organized

### Key Files Created:
- `frontend/src/index.js` - React DOM root
- `frontend/src/App.js` - Main app with routing
- `frontend/src/App.css` - App styles
- `frontend/src/index.css` - Global styles
- `frontend/src/reportWebVitals.js` - Performance monitoring
- `frontend/src/setupTests.js` - Jest configuration
- `backend/src/controllers/authController.js` - Authentication logic
- `backend/src/controllers/deskController.js` - Desk operations
- `backend/src/controllers/roomController.js` - Meeting room operations

## Getting Started

### Backend
```bash
cd backend
npm install
npm run dev  # Development with nodemon
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Architecture Notes
- **Backend**: Express.js with MongoDB (Mongoose)
- **Frontend**: React with Redux Toolkit for state management
- **Styling**: Material-UI, Emotion CSS-in-JS
- **API Communication**: Axios
- **Authentication**: JWT tokens
- **Form Validation**: Formik + Yup

