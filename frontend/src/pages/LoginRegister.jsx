import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api';
import { Lock, Mail, User, Building, ArrowLeft } from 'lucide-react';

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email: formData.email, password: formData.password } : formData;
      
      const res = await axios.post(endpoint, payload);
      
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/ngo/dashboard');
      } else {
        setIsLogin(true);
        setFormData({ ...formData, password: '' });
        alert('Registration successful! Please log in.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 animate-in slide-in-from-bottom-8 duration-500 relative z-10">
      <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-xs font-bold uppercase tracking-widest justify-center">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <div className="bg-[#1c1c1c] p-6 md:p-10 rounded-3xl md:rounded-[40px] shadow-2xl border border-[#2a2a2a] relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#a4e857] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#ff9f31] opacity-10 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-[#2a2a2a] text-white rounded-full mb-6">
            <Building className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-heading text-white uppercase tracking-wider mb-2">
            {isLogin ? 'ACCESS PORTAL' : 'INITIALIZE NGO'}
          </h1>
          <p className="text-gray-400 text-sm">
            {isLogin ? 'Enter your credentials to manage campaigns' : 'Create a profile to start raising funds'}
          </p>
        </div>

        <div className="relative z-10">
          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl mb-6 text-sm border border-red-500/20 font-bold uppercase tracking-wider text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Organization Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-[#111111] border border-[#2a2a2a] rounded-2xl focus:bg-[#151515] focus:outline-none focus:border-[#a4e857] transition-colors text-white"
                    placeholder="Hope Foundation"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-[#111111] border border-[#2a2a2a] rounded-2xl focus:bg-[#151515] focus:outline-none focus:border-[#a4e857] transition-colors text-white"
                  placeholder="contact@org.org"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Security Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-[#111111] border border-[#2a2a2a] rounded-2xl focus:bg-[#151515] focus:outline-none focus:border-[#a4e857] transition-colors text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#a4e857] text-[#111111] py-4 rounded-full font-bold hover:bg-[#90d646] shadow-lg shadow-[#a4e857]/10 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 mt-4 uppercase tracking-widest text-sm"
            >
              {loading ? 'PROCESSING...' : (isLogin ? 'AUTHENTICATE' : 'REGISTER')}
            </button>
          </form>
          
          <div className="mt-10 text-center text-xs font-bold tracking-widest uppercase">
            <p className="text-gray-500">
              {isLogin ? "No profile? " : "Active profile? "}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-white hover:text-[#a4e857] transition-colors ml-2 focus:outline-none"
              >
                {isLogin ? 'Register Here' : 'Authenticate Here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
