import { Link } from 'react-router-dom';

export default function CauseCard({ cause }) {
  // We'll calculate a dummy progress or use raisedAmount if passed in later
  // For simplicity we show raised vs goal if we have it, otherwise just a generic progress bar
  const raised = cause.raisedAmount || 0;
  const progress = Math.min(100, Math.round((raised / cause.goalAmount) * 100)) || 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 group">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={cause.imageUrl || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?auto=format&fit=crop&q=80'} 
          alt={cause.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?auto=format&fit=crop&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <h3 className="absolute bottom-4 left-4 right-4 text-white font-bold text-xl line-clamp-1">{cause.title}</h3>
      </div>
      
      <div className="p-5">
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">{cause.description}</p>
        
        <div className="space-y-2 mb-5">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-[#f59e0b]">${raised.toLocaleString()} raised</span>
            <span className="text-gray-500">of ${cause.goalAmount.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#f59e0b] h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Link 
            to={`/cause/${cause._id}`}
            className="flex-1 text-center bg-gray-50 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-100 transition-colors"
          >
            Details
          </Link>
          <Link 
            to={`/donate/${cause._id}`}
            className="flex-1 text-center bg-[#f59e0b] text-white py-2.5 rounded-xl font-medium hover:bg-[#d97706] shadow-sm shadow-orange-200 transition-all hover:-translate-y-0.5"
          >
            Donate
          </Link>
        </div>
      </div>
    </div>
  );
}
