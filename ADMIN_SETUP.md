# 🔐 Admin Setup Guide

## Create First Admin User

### Option 1: Using NPM Script (Recommended)
```bash
cd backend
npm run create-admin
```

### Option 2: Using API Endpoint
```bash
curl -X POST http://localhost:5001/api/auth/create-first-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@coworkspace.com",
    "password": "admin123"
  }'
```

## Default Admin Credentials

- **Email:** admin@coworkspace.com
- **Password:** admin123
- **Role:** admin

⚠️ **Important:** Change the password immediately after first login!

## Login as Admin

1. Go to `http://localhost:3000/login`
2. Enter admin credentials
3. You'll be redirected to dashboard
4. Click on "Admin" in the sidebar to access admin panel

## Admin Features

- ✅ View all desks, rooms, and bookings
- ✅ Create/Edit/Delete desks
- ✅ Create/Edit/Delete meeting rooms
- ✅ View all user bookings
- ✅ Track revenue and statistics
- ✅ Manage announcements

## Admin User Experience

### What Admin Sees:
- ✅ **Single Admin Dashboard** - Only admin panel visible
- ✅ **All Management Features** - Desks, rooms, bookings, revenue
- ✅ **No User Features** - Dashboard, bookings, billing pages hidden
- ✅ **Direct Login** - Automatically redirected to `/admin` after login
- ✅ **Admin Badge** - Special red admin indicator in sidebar

### What Admin Cannot Access:
- ❌ Regular user dashboard
- ❌ User booking pages
- ❌ User billing pages
- ❌ User profile pages

Admin users have a completely separate experience focused on management tasks only.

## Security Notes

1. **Change default password** immediately
2. **Remove create-first-admin endpoint** in production
3. **Use environment variables** for admin credentials
4. **Enable 2FA** for admin accounts (future feature)

## Promote Existing User to Admin

Using MongoDB:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

## Admin Role Permissions

Current permissions for admin role:
- Full access to desk management
- Full access to room management
- View all bookings from all users
- Cancel any booking
- Create/edit/delete announcements
- View all revenue and statistics
