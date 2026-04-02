import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const user = useSelector((state) => state.auth?.user) || JSON.parse(localStorage.getItem('user')) || {};

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search bookings, desks, rooms..." 
            className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all text-sm font-medium outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-tight">{user.name || 'User'}</p>
            <p className="text-xs text-slate-500 font-medium">{user.role || 'Member'}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-accent overflow-hidden hover:scale-105 transition-transform cursor-pointer">
            <User size={24} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
