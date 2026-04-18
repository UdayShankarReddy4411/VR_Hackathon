import { Link, useNavigate } from 'react-router-dom';
import { Package, BarChart2, MessageSquare, Search, LogOut } from 'lucide-react';

export default function TopNav() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="h-auto md:h-24 px-4 md:px-8 py-4 md:py-0 flex flex-col md:flex-row items-center justify-between w-full gap-4 md:gap-0">
      <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        <Link to="/" className="flex items-center gap-2 bg-[#1c1c1c] hover:bg-[#2a2a2a] px-4 md:px-6 py-2 md:py-3 rounded-full transition-colors border border-[#2a2a2a] whitespace-nowrap">
          <Package className="h-4 w-4 text-gray-400" />
          <span className="text-xs md:text-sm font-bold text-white">Causes</span>
        </Link>
        <Link to="/ngo/dashboard" className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] px-4 md:px-6 py-2 md:py-3 rounded-full transition-colors border border-transparent whitespace-nowrap">
          <BarChart2 className="h-4 w-4 text-gray-400" />
          <span className="text-xs md:text-sm font-bold text-gray-300">Dashboard</span>
        </Link>
        <Link to="#" className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] px-4 md:px-6 py-2 md:py-3 rounded-full transition-colors border border-transparent whitespace-nowrap">
          <MessageSquare className="h-4 w-4 text-gray-400" />
          <span className="text-xs md:text-sm font-bold text-gray-300">Support</span>
        </Link>
        <button className="bg-[#1a1a1a] hover:bg-[#2a2a2a] w-10 md:w-12 h-10 md:h-12 flex-shrink-0 rounded-full flex items-center justify-center transition-colors">
          <Search className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <div className="flex items-center gap-6 w-full md:w-auto justify-end">
        {token ? (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white leading-tight">{user?.name}</p>
              <p className="text-xs text-gray-500">@{user?.name?.toLowerCase().replace(/\s+/g, '') || 'user'}</p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden border-2 border-[#111111]">
                <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#111111] flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">2</span>
              </div>
            </div>
            <button onClick={handleLogout} className="ml-2 md:ml-4 text-gray-500 hover:text-red-500 transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <Link to="/ngo/login" className="bg-[#a4e857] text-[#111111] px-6 py-2 md:py-3 rounded-full text-sm font-bold hover:bg-[#90d646] transition-colors">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
