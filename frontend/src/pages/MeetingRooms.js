import React, { useState, useEffect } from 'react';
import { roomAPI, bookingAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  MapPin, 
  Clock, 
  Zap, 
  ChevronRight, 
  Filter, 
  Search,
  X,
  Check,
  MessageSquare,
  UserPlus
} from 'lucide-react';

const MeetingRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomAPI.getAllRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = async (e) => {
    e.preventDefault();
    try {
      await bookingAPI.createRoomBooking({
        roomId: selectedRoom._id,
        ...bookingData
      });
      toast.success('Room booked successfully!');
      setShowBookingModal(false);
      setSelectedRoom(null);
      setBookingData({ startTime: '', endTime: '', purpose: '', attendees: 1 });
      fetchRooms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Preparing meeting spaces...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Meeting Rooms</h1>
            <p className="text-slate-500 mt-1 font-medium text-lg">Professional spaces for collaboration and creativity.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge bg-indigo-500 text-white flex items-center gap-1">
              <Check size={12} /> {rooms.filter(r => r.isAvailable).length} Available
            </span>
            <span className="badge bg-slate-200 text-slate-600">
              {rooms.length} Total
            </span>
          </div>
        </div>

        {/* Search & Action Bar */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-soft flex flex-wrap items-center gap-2">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search rooms by name, capacity, or floor..." 
              className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-sm font-medium focus:ring-0 outline-none"
            />
          </div>
          <button className="bg-slate-50 text-slate-600 font-bold px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2">
            <Filter size={18} /> Filters
          </button>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div 
            key={room._id}
            className={`card group flex flex-col ${!room.isAvailable ? 'opacity-60 grayscale-[0.3]' : ''}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${room.isAvailable ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">{room.name}</h3>
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tight">
                    <MapPin size={12} /> RM-{room.roomNumber}
                  </p>
                </div>
              </div>
              <div className={`badge ${room.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {room.isAvailable ? 'Ready' : 'In Use'}
              </div>
            </div>

            <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2">
              {room.description || 'A state-of-the-art professional environment designed for focused collaboration.'}
            </p>

            <div className="space-y-4 mb-8 mt-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
                  <p className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Users size={14} className="text-indigo-500" /> {room.capacity} People
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Hourly Rate</p>
                  <p className="text-sm font-black text-slate-900">
                    ${room.hourlyRate}<span className="text-xs font-bold text-slate-400">/HR</span>
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {room.amenities?.map((amenity, i) => (
                  <span key={i} className="text-[10px] font-extrabold uppercase px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <button 
              disabled={!room.isAvailable}
              onClick={() => {
                setSelectedRoom(room);
                setShowBookingModal(true);
              }}
              className={`w-full font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                room.isAvailable 
                ? 'bg-accent text-white hover:bg-accent-dark shadow-lg shadow-accent/20' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {room.isAvailable ? (
                <>Reserve Meeting Space <ChevronRight size={18} /></>
              ) : (
                <>Room Reserved</>
              )}
            </button>
          </div>
        ))}
      </section>

      {/* Modal Redesign */}
      {showBookingModal && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-8 pb-0 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-black text-slate-900 leading-tight">Room Reservation</h2>
                <p className="text-slate-500 font-medium mt-1">{selectedRoom.name} • RM-{selectedRoom.roomNumber}</p>
              </div>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleBookRoom} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Check-in</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent" size={18} />
                    <input
                      type="datetime-local"
                      value={bookingData.startTime}
                      onChange={(e) => setBookingData({...bookingData, startTime: e.target.value})}
                      required
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-accent/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Check-out</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent" size={18} />
                    <input
                      type="datetime-local"
                      value={bookingData.endTime}
                      onChange={(e) => setBookingData({...bookingData, endTime: e.target.value})}
                      required
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-accent/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-slate-900 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Meeting Purpose</label>
                  <div className="relative group">
                    <MessageSquare className="absolute left-4 top-4 text-slate-400 group-focus-within:text-accent" size={18} />
                    <textarea
                      value={bookingData.purpose}
                      onChange={(e) => setBookingData({...bookingData, purpose: e.target.value})}
                      required
                      rows="2"
                      placeholder="Briefly describe the goal of this meeting"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-accent/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-slate-900 transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Expected Attendees</label>
                  <div className="relative group">
                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent" size={18} />
                    <input
                      type="number"
                      min="1"
                      max={selectedRoom.capacity}
                      value={bookingData.attendees}
                      onChange={(e) => setBookingData({...bookingData, attendees: parseInt(e.target.value)})}
                      required
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-accent/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-slate-900 transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold ml-1 italic italic">Max room capacity: {selectedRoom.capacity} People</p>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Pricing Plan</p>
                    <p className="text-lg font-black text-slate-900">${selectedRoom.hourlyRate}<span className="text-sm font-bold text-slate-400">/hr</span></p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-4 px-6 border-2 border-slate-100 font-bold text-slate-500 rounded-xl hover:bg-slate-50 transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 px-6 bg-accent text-white font-bold rounded-xl shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all text-center"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingRooms;