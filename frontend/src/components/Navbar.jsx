import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, HeartHandshake } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-[#1f1f1f] text-white shadow-sm border-b border-gray-800 relative z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-colors">
          <HeartHandshake className="h-8 w-8 text-[#f59e0b]" />
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl tracking-wider text-white leading-tight uppercase">Charity</span>
            <span className="text-[#f59e0b] text-sm font-medium">Can Make a Difference</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-300 hover:text-[#f59e0b] font-bold text-sm tracking-wide uppercase transition-colors">
            Home
          </Link>
          <Link to="/" className="text-gray-300 hover:text-[#f59e0b] font-bold text-sm tracking-wide uppercase transition-colors">
            About Us
          </Link>
          <Link to="/" className="text-gray-300 hover:text-[#f59e0b] font-bold text-sm tracking-wide uppercase transition-colors">
            Causes
          </Link>
          
          {token ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-700">
              {user?.role === 'admin' ? (
                <Link to="/admin/dashboard" className="text-gray-300 hover:text-[#f59e0b] font-bold text-sm tracking-wide uppercase transition-colors">
                  Admin
                </Link>
              ) : (
                <Link to="/ngo/dashboard" className="text-gray-300 hover:text-[#f59e0b] font-bold text-sm tracking-wide uppercase transition-colors">
                  Dashboard
                </Link>
              )}
              <span className="text-sm text-gray-400 flex items-center gap-1 font-medium">
                <UserIcon className="h-4 w-4" />
                {user?.name}
              </span>
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link 
              to="/ngo/login" 
              className="ml-2 px-5 py-2 border-2 border-gray-600 text-gray-300 rounded-md font-bold hover:border-[#f59e0b] hover:text-[#f59e0b] transition-colors uppercase text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
