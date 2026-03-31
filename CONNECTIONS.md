# Frontend-Backend Connections Map

## ✅ All Connections Verified

### Authentication Flow
```
Frontend (Login.js) → authSlice.login() → api.js authAPI.login()
    ↓
Backend /api/auth/login → auth.js route → authController.login()
    ↓
Database: User Model → Returns JWT token + user data
```

### Desk Management Flow
```
Frontend (Desks.js) → deskAPI.getAllDesks()
    ↓
Backend /api/desks → desk.js route → deskController.getAllDesks()
    ↓
Database: Desk Model → Returns array of desks

Frontend (Desks.js) → bookingAPI.createDeskBooking()
    ↓
Backend /api/bookings/desks → booking.js route → bookingController.createDeskBooking()
    ↓
Database: DeskBooking Model → Creates booking
```

### Meeting Room Flow
```
Frontend (MeetingRooms.js) → roomAPI.getAllRooms()
    ↓
Backend /api/rooms → meetingRoom.js route → roomController.getAllRooms()
    ↓
Database: MeetingRoom Model → Returns array of rooms

Frontend (MeetingRooms.js) → bookingAPI.createRoomBooking()
    ↓
Backend /api/bookings/rooms → booking.js route → bookingController.createRoomBooking()
    ↓
Database: RoomBooking Model → Creates booking
```

### Announcements Flow
```
Frontend (Announcements.js) → announcementAPI.getAllAnnouncements()
    ↓
Backend /api/announcements → announcement.js route → announcementController.getAllAnnouncements()
    ↓
Database: Announcement Model → Returns array of announcements
```

## API Endpoints Summary

### Auth Endpoints ✅
- `POST /api/auth/register` → Register new user
- `POST /api/auth/login` → Login user
- `GET /api/auth/me` → Get current user profile
- `PUT /api/auth/update-profile` → Update user profile

### Desk Endpoints ✅
- `GET /api/desks` → Get all desks
- `GET /api/desks/:id` → Get desk by ID
- `POST /api/desks` → Create desk (Admin)
- `PUT /api/desks/:id` → Update desk (Admin)
- `DELETE /api/desks/:id` → Delete desk (Admin)

### Meeting Room Endpoints ✅
- `GET /api/rooms` → Get all rooms
- `GET /api/rooms/:id` → Get room by ID
- `POST /api/rooms` → Create room (Admin)
- `PUT /api/rooms/:id` → Update room (Admin)
- `DELETE /api/rooms/:id` → Delete room (Admin)

### Booking Endpoints ✅
- `POST /api/bookings/desks` → Create desk booking
- `GET /api/bookings/desks/my` → Get user's desk bookings
- `GET /api/bookings/desks` → Get all desk bookings (Admin)
- `PUT /api/bookings/desks/:id/cancel` → Cancel desk booking
- `POST /api/bookings/rooms` → Create room booking
- `GET /api/bookings/rooms/my` → Get user's room bookings
- `GET /api/bookings/rooms` → Get all room bookings (Admin)
- `PUT /api/bookings/rooms/:id/cancel` → Cancel room booking

### Announcement Endpoints ✅
- `GET /api/announcements` → Get all announcements
- `GET /api/announcements/:id` → Get announcement by ID
- `POST /api/announcements` → Create announcement (Admin)
- `PUT /api/announcements/:id` → Update announcement (Admin)
- `DELETE /api/announcements/:id` → Delete announcement (Admin)

## Frontend Services (api.js) ✅

All API calls are properly configured in `/frontend/src/services/api.js`:

- ✅ authAPI - Authentication services
- ✅ deskAPI - Desk management
- ✅ roomAPI - Meeting room management
- ✅ bookingAPI - Booking services
- ✅ announcementAPI - Announcement services

## Redux State Management ✅

- ✅ authSlice - Authentication state
- ✅ store.js - Redux store configuration

## Models ✅

All models are properly defined and connected:

- ✅ User.js
- ✅ Desk.js
- ✅ MeetingRoom.js
- ✅ DeskBooking.js
- ✅ RoomBooking.js
- ✅ Announcement.js
- ✅ Billing.js

## Middleware ✅

- ✅ auth.js - JWT authentication middleware
- ✅ Request interceptors for token handling
- ✅ Response interceptors for error handling

## Everything is Connected! 🎉

All controllers, routes, models, and frontend services are properly connected and working together.
