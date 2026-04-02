import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { Lock, Mail, ArrowRight, Layout } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      const user = result.payload.user;
      if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-fade-in font-sans">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-accent/20 mb-6">
            <Layout size={32} />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
          <p className="text-slate-500 font-medium text-lg">Enter your details to access CoworkSpace</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-soft border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.1em] px-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-accent/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-slate-900 transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.1em] px-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-accent/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-slate-900 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-accent text-white font-bold rounded-2xl shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all text-center flex items-center justify-center gap-2 group"
            >
              {isLoading ? 'Signing in...' : (
                <>Sign in to Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium">
              New here?{' '}
              <Link to="/register" className="text-accent font-bold hover:underline decoration-2 underline-offset-4">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;