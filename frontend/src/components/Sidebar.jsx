import { Link, useLocation } from 'react-router-dom';
import { Heart, Calendar, Award, Settings, Plus } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { icon: Heart, path: '/' },
    { icon: Calendar, path: '/ngo/dashboard' },
    { icon: Award, path: '/admin/dashboard' },
    { icon: Settings, path: '#' }
  ];

  return (
    <div className="w-24 h-full py-8 flex flex-col items-center border-r border-[#2a2a2a] bg-[#111111]">
      <Link to="/" className="mb-12">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <span className="text-black font-heading text-2xl font-bold tracking-tighter">HB</span>
        </div>
      </Link>

      <div className="flex-1 flex flex-col items-center gap-6">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link 
              key={index} 
              to={item.path}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                active 
                  ? 'bg-[#2a2a2a] text-white shadow-lg' 
                  : 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </div>

      <button className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-all">
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
