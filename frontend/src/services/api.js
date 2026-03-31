import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
  timeout: 10000,
  decompress: true,
});

/* ============================
   REQUEST INTERCEPTOR
============================ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // force fresh request every time
    config.headers['Cache-Control'] = 'no-cache';

    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================
   RESPONSE INTERCEPTOR
============================ */
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `✅ ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status}`
      );
    }
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        '❌ Response error:',
        error.response?.status,
        error.response?.data?.message || error.message
      );
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

/* ============================
   AUTH SERVICES
============================ */
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) =>
    api.put('/auth/update-profile', profileData),
};

/* ============================
   DESK SERVICES
============================ */
export const deskAPI = {
  getAllDesks: () => api.get('/desks'),
  getDeskById: (id) => api.get(`/desks/${id}`),
  createDesk: (deskData) => api.post('/desks', deskData),
  updateDesk: (id, deskData) => api.put(`/desks/${id}`, deskData),
  deleteDesk: (id) => api.delete(`/desks/${id}`),
};

/* ============================
   ROOM SERVICES
============================ */
export const roomAPI = {
  getAllRooms: () => api.get('/rooms'),
  getRoomById: (id) => api.get(`/rooms/${id}`),
  createRoom: (roomData) => api.post('/rooms', roomData),
  updateRoom: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
};

/* ============================
   ANNOUNCEMENT SERVICES
============================ */
export const announcementAPI = {
  getAllAnnouncements: () => api.get('/announcements'),
  getAnnouncementById: (id) => api.get(`/announcements/${id}`),
  createAnnouncement: (data) => api.post('/announcements', data),
  updateAnnouncement: (id, data) =>
    api.put(`/announcements/${id}`, data),
  deleteAnnouncement: (id) =>
    api.delete(`/announcements/${id}`),
};

/* ============================
   BOOKING SERVICES
============================ */
export const bookingAPI = {
  // Desk bookings
  createDeskBooking: (bookingData) =>
    api.post('/bookings/desks', bookingData),
  getUserDeskBookings: () =>
    api.get('/bookings/desks/my'),
  getAllDeskBookings: () =>
    api.get('/bookings/desks'),
  cancelDeskBooking: (id) =>
    api.put(`/bookings/desks/${id}/cancel`),

  // Room bookings
  createRoomBooking: (bookingData) =>
    api.post('/bookings/rooms', bookingData),
  getUserRoomBookings: () =>
    api.get('/bookings/rooms/my'),
  getAllRoomBookings: () =>
    api.get('/bookings/rooms'),
  cancelRoomBooking: (id) =>
    api.put(`/bookings/rooms/${id}/cancel`),
};

/* ============================
   BILLING SERVICES
============================ */
export const billingAPI = {
  getUserInvoices: () => api.get('/billing/invoices'),
  getInvoiceById: (id) =>
    api.get(`/billing/invoices/${id}`),
  generateInvoice: (data) =>
    api.post('/billing/generate', data),
  payInvoice: (id, paymentData) =>
    api.put(`/billing/invoices/${id}/pay`, paymentData),
  getBillingSummary: () =>
    api.get('/billing/summary'),
};

export default api;
