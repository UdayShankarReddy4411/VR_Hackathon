import { Link, useNavigate } from 'react-router-dom';
import { Heart, LogOut, User as UserIcon } from 'lucide-react';

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
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors">
          <Heart className="h-6 w-6 fill-current" />
          <span className="font-bold text-xl tracking-tight">HopeBridge</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
            Causes
          </Link>
          
          {token ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
              {user?.role === 'admin' ? (
                <Link to="/admin/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                  Admin Dashboard
                </Link>
              ) : (
                <Link to="/ngo/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                  Dashboard
                </Link>
              )}
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                {user?.name}
              </span>
              <button 
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 transition-colors p-1"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link 
              to="/ngo/login" 
              className="ml-4 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
            >
              NGO Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
