import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { Calendar, Monitor, Users, Trash2, Clock, MapPin, ChevronRight } from 'lucide-react';

const Bookings = () => {
  const [deskBookings, setDeskBookings] = useState([]);
  const [roomBookings, setRoomBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('desks');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const [deskRes, roomRes] = await Promise.all([
        bookingAPI.getUserDeskBookings(),
        bookingAPI.getUserRoomBookings(),
      ]);
      setDeskBookings(deskRes.data.bookings || []);
      setRoomBookings(roomRes.data.bookings || []);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id, type) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      if (type === 'desk') await bookingAPI.cancelDeskBooking(id);
      else await bookingAPI.cancelRoomBooking(id);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
        <p className="text-slate-500 mt-1 font-medium text-lg">Keep track of your upcoming and past reservations.</p>
      </header>

      <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('desks')}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'desks' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Desks ({deskBookings.length})
        </button>
        <button 
          onClick={() => setActiveTab('rooms')}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'rooms' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Rooms ({roomBookings.length})
        </button>
      </div>

      <div className="grid gap-4">
        {(activeTab === 'desks' ? deskBookings : roomBookings).length === 0 ? (
          <div className="card text-center py-20">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Calendar size={32} />
            </div>
            <p className="text-slate-500 font-bold">No bookings found in this category.</p>
          </div>
        ) : (
          (activeTab === 'desks' ? deskBookings : roomBookings).map((booking) => (
            <div key={booking._id} className="card !p-5 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeTab === 'desks' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {activeTab === 'desks' ? <Monitor size={24} /> : <Users size={24} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg uppercase tracking-tight">
                    {activeTab === 'desks' ? `Desk ${booking.desk?.deskNumber}` : booking.meetingRoom?.name}
                  </h4>
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                    <MapPin size={12} /> {activeTab === 'desks' ? booking.desk?.location : 'Main Floor'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</p>
                  <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    {new Date(booking.bookingDate || booking.startTime).toLocaleDateString()} • {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                  <span className={`badge text-[10px] ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {booking.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                {booking.status === 'confirmed' && (
                  <button 
                    onClick={() => handleCancelBooking(booking._id, activeTab === 'desks' ? 'desk' : 'room')}
                    className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Cancel Booking"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                <button className="p-3 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Bookings;