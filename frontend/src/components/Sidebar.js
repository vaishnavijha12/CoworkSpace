import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Monitor, 
  Users, 
  CalendarCheck, 
  Megaphone, 
  CreditCard 
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Desks', path: '/desks', icon: Monitor },
    { name: 'Meeting Rooms', path: '/meeting-rooms', icon: Users },
    { name: 'My Bookings', path: '/bookings', icon: CalendarCheck },
    { name: 'Announcements', path: '/announcements', icon: Megaphone },
    { name: 'Billing', path: '/billing', icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col border-r border-slate-800">
      <div className="p-6 mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white text-lg">C</div>
          CoworkSpace
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                : 'hover:bg-slate-800 hover:text-white'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                <span className="font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Workspace</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white">HQ</div>
            <div>
              <p className="text-sm font-bold text-white">Main Office</p>
              <p className="text-xs text-slate-400">London, UK</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
