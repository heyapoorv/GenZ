import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, userInfo, isLoading, error } = useAuthStore();

  const redirect = location.search ? location.search.split('=')[1] : '/dashboard';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <main className="pt-[120px] pb-section-gap min-h-screen flex items-center justify-center px-margin-mobile">
      <div className="w-full max-w-md bg-surface-container border border-outline-variant/10 p-8">
        <div className="text-center mb-8">
          <h1 className="font-headline-lg text-[32px] uppercase mb-2">Member Login</h1>
          <p className="font-body-md text-on-surface-variant">Enter your credentials to access your Zenith Portal.</p>
        </div>
        
        {error && <div className="bg-error/10 border border-error/20 text-error p-3 mb-6 font-body-md text-sm">{error}</div>}
        
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-2">
            <label className="font-label-caps text-xs text-on-surface-variant uppercase">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-highest border-outline-variant/10 focus:border-primary focus:ring-1 outline-none rounded-none text-on-surface h-12 px-4 font-body-md" 
              placeholder="operator@zenith.com" 
            />
          </div>
          <div className="space-y-2">
            <label className="font-label-caps text-xs text-on-surface-variant uppercase">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-highest border-outline-variant/10 focus:border-primary focus:ring-1 outline-none rounded-none text-on-surface h-12 px-4 font-body-md" 
              placeholder="••••••••" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-primary text-on-primary font-button-text text-sm uppercase tracking-widest hover:opacity-90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-outline-variant/10 text-center">
          <p className="font-body-md text-sm text-on-surface-variant">
            New to Zenith Arcade? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-primary hover:underline">Request Access</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
