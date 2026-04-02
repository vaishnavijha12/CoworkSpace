import React, { useState, useEffect } from 'react';
import { deskAPI, bookingAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  Monitor, 
  MapPin, 
  Clock, 
  Zap, 
  ChevronRight, 
  Filter, 
  Search,
  X,
  Check
} from 'lucide-react';

const Desks = () => {
  const [desks, setDesks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filters, setFilters] = useState({ zone: '', type: '', amenities: '' });
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    bookingType: 'hourly'
  });

  useEffect(() => {
    fetchDesks();
  }, []);

  const fetchDesks = async () => {
    try {
      setLoading(true);
      const response = await deskAPI.getAllDesks();
      setDesks(response.data);
    } catch (error) {
      console.error('Error fetching desks:', error);
      toast.error('Failed to load desks');
    } finally {
      setLoading(false);
    }
  };

  const handleBookDesk = async (e) => {
    e.preventDefault();
    try {
      await bookingAPI.createDeskBooking({
        deskId: selectedDesk._id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        bookingType: bookingData.bookingType
      });
      toast.success('Desk booked successfully!');
      setShowBookingModal(false);
      setSelectedDesk(null);
      setBookingData({ startDate: '', endDate: '', bookingType: 'hourly' });
      fetchDesks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  const filteredDesks = desks.filter(desk => {
    if (filters.zone && desk.location !== filters.zone) return false;
    if (filters.type && desk.type !== filters.type) return false;
    // Simple amenity check if applicable
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Fetching workspaces...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Filters */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Available Desks</h1>
            <p className="text-slate-500 mt-1 font-medium text-lg">Find the perfect spot for your productivity today.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge bg-emerald-500 text-white flex items-center gap-1">
              <Check size={12} /> {desks.filter(d => d.isAvailable).length} Available
            </span>
            <span className="badge bg-slate-200 text-slate-600">
              {desks.length} Total
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-soft flex flex-wrap items-center gap-2">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by desk number or keywords..." 
              className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-sm font-medium focus:ring-0 outline-none"
            />
          </div>
          <div className="h-8 w-px bg-slate-200 hidden md:block mx-2"></div>
          <select 
            className="bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-accent/20 outline-none cursor-pointer"
            onChange={(e) => setFilters({...filters, zone: e.target.value})}
          >
            <option value="">All Zones</option>
            {[...new Set(desks.map(d => d.location))].map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <select 
            className="bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-accent/20 outline-none cursor-pointer"
            onChange={(e) => setFilters({...filters, type: e.target.value})}
          >
            <option value="">All Types</option>
            <option value="Hot Desk">Hot Desk</option>
            <option value="Fixed Desk">Fixed Desk</option>
            <option value="Standing Desk">Standing Desk</option>
          </select>
          <button className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-slate-800 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </section>

      {/* Desks Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDesks.map((desk) => (
          <div 
            key={desk._id}
            className={`card group ${!desk.isAvailable ? 'opacity-60 grayscale-[0.5]' : ''}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${desk.isAvailable ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Monitor size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 uppercase">Desk {desk.deskNumber}</h3>
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                    <MapPin size={12} /> {desk.location}
                  </p>
                </div>
              </div>
              <div className={`badge ${desk.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {desk.isAvailable ? 'Available' : 'Occupied'}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Type</span>
                <span className="text-slate-900 font-bold">{desk.type}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Rate</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">${desk.hourlyRate}</span>
                  <span className="text-slate-400 font-bold text-xs ml-1">/HR</span>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex flex-wrap gap-2">
                  {desk.amenities?.slice(0, 3).map((amenity, i) => (
                    <span key={i} className="text-[10px] font-extrabold uppercase px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                      {amenity}
                    </span>
                  ))}
                  {desk.amenities?.length > 3 && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                      +{desk.amenities.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button 
              disabled={!desk.isAvailable}
              onClick={() => {
                setSelectedDesk(desk);
                setShowBookingModal(true);
              }}
              className={`w-full font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                desk.isAvailable 
                ? 'bg-accent text-white hover:bg-accent-dark shadow-lg shadow-accent/20' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {desk.isAvailable ? (
                <>Book this workspace <ChevronRight size={18} /></>
              ) : (
                <>Currently Occupied</>
              )}
            </button>
          </div>
        ))}
      </section>

      {/* Modal Redesign */}
      {showBookingModal && selectedDesk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-8 pb-0 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-black text-slate-900 leading-tight">Confirm Booking</h2>
                <p className="text-slate-500 font-medium mt-1">Desk {selectedDesk.deskNumber} • {selectedDesk.location}</p>
              </div>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleBookDesk} className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Check-in Time</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent" size={18} />
                    <input
                      type="datetime-local"
                      value={bookingData.startDate}
                      onChange={(e) => setBookingData({...bookingData, startDate: e.target.value})}
                      required
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-accent/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Check-out Time</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent" size={18} />
                    <input
                      type="datetime-local"
                      value={bookingData.endDate}
                      onChange={(e) => setBookingData({...bookingData, endDate: e.target.value})}
                      required
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-accent/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-slate-900 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Rate Estimate</p>
                    <p className="text-lg font-black text-slate-900">${selectedDesk.hourlyRate}<span className="text-sm font-bold text-slate-400">/hr</span></p>
                  </div>
                </div>
                <button type="button" className="text-xs font-bold text-indigo-600 hover:underline">Pricing Details</button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-4 px-6 border-2 border-slate-100 font-bold text-slate-500 rounded-xl hover:bg-slate-50 transition-all"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 px-6 bg-accent text-white font-bold rounded-xl shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all text-center"
                >
                  Pay & Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Desks;