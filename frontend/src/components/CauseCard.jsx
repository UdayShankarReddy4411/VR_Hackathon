import { Link } from 'react-router-dom';

export default function CauseCard({ cause }) {
  const raised = cause.raisedAmount || 0;
  const progress = Math.min(100, Math.round((raised / cause.goalAmount) * 100)) || 0;

  return (
    <div className="bg-[#1c1c1c] rounded-3xl border border-[#2a2a2a] overflow-hidden hover:border-[#a4e857] transition-all duration-300 group flex flex-col h-full shadow-2xl">
      <div className="h-48 overflow-hidden relative bg-[#111111] p-2">
        <div className="w-full h-full rounded-2xl overflow-hidden relative">
          <img
            src={cause.imageUrl || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?auto=format&fit=crop&q=80'}
            alt={cause.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?auto=format&fit=crop&q=80'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-transparent to-transparent"></div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-white font-heading text-2xl tracking-wide mb-2 line-clamp-1 uppercase">{cause.title}</h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-6 flex-1">{cause.description}</p>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Raised</p>
              <span className="font-bold text-[#a4e857] text-xl leading-none">${raised.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Target</p>
              <span className="font-bold text-gray-300 text-xl leading-none">${cause.goalAmount.toLocaleString()}</span>
            </div>
          </div>
          <div className="w-full bg-[#111111] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#a4e857] h-full rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex gap-3 mt-auto">
          <Link
            to={`/cause/${cause._id}`}
            className="flex-1 text-center bg-[#111111] border border-[#2a2a2a] text-gray-300 py-3 rounded-full font-bold hover:bg-[#2a2a2a] transition-colors text-xs uppercase tracking-widest"
          >
            Details
          </Link>
          <Link
            to={`/donate/${cause._id}`}
            className="flex-1 text-center bg-[#a4e857] text-[#111111] py-3 rounded-full font-bold hover:bg-[#90d646] transition-colors text-xs uppercase tracking-widest"
          >
            Donate
          </Link>
        </div>
      </div>
    </div>
  );
}
