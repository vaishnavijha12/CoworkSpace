import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Monitor, 
  Users, 
  CreditCard, 
  Plus, 
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
  <div className="card group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 text-opacity-100 transition-transform group-hover:scale-110`}>
        <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
      </div>
    </div>
    <div>
      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
      <p className="text-xs font-medium text-slate-400">{subtitle}</p>
    </div>
  </div>
);

const QuickAction = ({ title, icon: Icon, onClick, description }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-soft hover:shadow-lg hover:border-accent/30 transition-all text-left group"
  >
    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
      <Icon size={24} />
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-slate-900 leading-tight">{title}</h4>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </div>
    <ArrowRight size={18} className="text-slate-300 group-hover:text-accent group-hover:translate-x-1 transition-all" />
  </button>
);

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Ayush' };
  const navigate = useNavigate();

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  const activities = [
    { id: 1, type: 'booking', title: 'Desk A-12', detail: 'Confirmed for today', time: '2h ago', icon: Monitor, color: 'text-indigo-500' },
    { id: 2, type: 'room', title: 'Strategy Room', detail: 'Reserved for 2:00 PM', time: '4h ago', icon: Users, color: 'text-emerald-500' },
    { id: 3, type: 'payment', title: 'Monthly Invoice', detail: 'Payment successful', time: 'Yesterday', icon: CheckCircle2, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-accent uppercase tracking-widest mb-2">{currentDate}</p>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, <span className="text-accent">{user.name}</span>!
            </h1>
            <p className="text-slate-500 mt-2 font-medium text-lg">
              You have <span className="text-slate-900 font-bold">3 active bookings</span> for this week.
            </p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-soft border border-slate-100 flex items-center gap-3">
            <Clock className="text-accent" size={20} />
            <span className="font-bold text-slate-900 text-lg">{currentTime}</span>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Bookings" 
          value="3" 
          subtitle="2 desks, 1 room" 
          icon={Calendar} 
          colorClass="bg-indigo-500" 
        />
        <StatCard 
          title="Total Desks" 
          value="50" 
          subtitle="12 currently available" 
          icon={Monitor} 
          colorClass="bg-emerald-500" 
        />
        <StatCard 
          title="Meeting Rooms" 
          value="12" 
          subtitle="Check availability" 
          icon={Users} 
          colorClass="bg-rose-500" 
        />
        <StatCard 
          title="Pending Invoices" 
          value="1" 
          subtitle="Due in 3 days" 
          icon={CreditCard} 
          colorClass="bg-amber-500" 
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Quick Actions</h2>
            <button className="text-sm font-bold text-accent hover:underline flex items-center gap-1">
              View all services <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickAction 
              title="Book a Desk" 
              icon={Monitor} 
              onClick={() => navigate('/desks')} 
              description="Find a perfect spot to focus"
            />
            <QuickAction 
              title="Reserve Room" 
              icon={Users} 
              onClick={() => navigate('/meeting-rooms')} 
              description="Space for your next big idea"
            />
            <QuickAction 
              title="Post Announcement" 
              icon={Megaphone} 
              onClick={() => navigate('/announcements')} 
              description="Share updates with the community"
            />
            <QuickAction 
              title="Make Payment" 
              icon={CreditCard} 
              onClick={() => navigate('/billing')} 
              description="Settle your outstanding invoices"
            />
          </div>
        </section>

        {/* Recent Activity */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Activity</h2>
          <div className="card !p-0 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {activities.map((activity) => (
                <div key={activity.id} className="p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                  <div className={`p-2 rounded-lg bg-slate-100 ${activity.color}`}>
                    <activity.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{activity.title}</p>
                    <p className="text-xs text-slate-500 font-medium">{activity.detail}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
            <button className="w-full p-4 text-sm font-bold text-slate-500 hover:text-accent hover:bg-slate-50 transition-all border-t border-slate-100">
              View All Activity
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

// Helper component for icon that I missed in my imports
const Megaphone = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 11 18-5v12L3 14v-3z" />
    <path d="M11.6 16.8 a3 3 0 1 1-5.8-1.2" />
  </svg>
);