import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Phone, Building, ArrowRight, Layout } from 'lucide-react';

const Register = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [company, setCompany] = React.useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    const result = await dispatch(register({ name, email, password, phone, company }));
    if (register.fulfilled.match(result)) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-fade-in font-sans">
      <div className="w-full max-w-lg space-y-8 py-12">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-accent/20 mb-6">
            <Layout size={32} />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Join CoworkSpace</h2>
          <p className="text-slate-500 font-medium text-lg">Create your professional workspace account</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-soft border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 col-span-full">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-accent/20 focus:bg-white rounded-2xl py-3.5 pl-12 shadow-inner font-bold text-slate-900 transition-all outline-none"
                    placeholder="Ayush Sharma"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 col-span-full">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-accent/20 focus:bg-white rounded-2xl py-3.5 pl-12 shadow-inner font-bold text-slate-900 transition-all outline-none"
                    placeholder="name@work.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-accent/20 focus:bg-white rounded-2xl py-3.5 pl-12 shadow-inner font-bold text-slate-900 transition-all outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Confirm</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent" size={18} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-accent/20 focus:bg-white rounded-2xl py-3.5 pl-12 shadow-inner font-bold text-slate-900 transition-all outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Phone</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent" size={18} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-accent/20 focus:bg-white rounded-2xl py-3.5 pl-12 shadow-inner font-bold text-slate-900 transition-all outline-none"
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Company</label>
                <div className="relative group">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent" size={18} />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-accent/20 focus:bg-white rounded-2xl py-3.5 pl-12 shadow-inner font-bold text-slate-900 transition-all outline-none"
                    placeholder="Company Ltd."
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4.5 py-4 bg-accent text-white font-black rounded-2xl shadow-lg shadow-accent/20 hover:scale-[1.01] active:scale-95 transition-all text-center flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? 'Creating account...' : <>Create Workspace Account <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-accent font-bold hover:underline decoration-2 underline-offset-4">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;