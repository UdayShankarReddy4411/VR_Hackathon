import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api';
import { Heart, Clock, User as UserIcon, Flag, ArrowLeft } from 'lucide-react';

export default function CauseDetail() {
  const { id } = useParams();
  const [cause, setCause] = useState(null);
  const [raised, setRaised] = useState(0);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flagged, setFlagged] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const [causeRes, donRes] = await Promise.all([
          axios.get(`/api/causes/${id}`),
          axios.get(`/api/donations/${id}`)
        ]);
        
        setCause(causeRes.data);
        setRaised(donRes.data.raisedAmount);
        setDonations(donRes.data.donations);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleFlag = async () => {
    if (!window.confirm('Are you sure you want to flag this cause as suspicious?')) return;
    try {
      await axios.post(`/api/causes/${id}/flag`, { reason: 'Suspicious content reported by user' });
      setFlagged(true);
      alert('This cause has been flagged for admin review.');
    } catch (err) {
      alert('Failed to flag cause');
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-[#1c1c1c] h-[600px] rounded-3xl border border-[#2a2a2a]"></div>;
  }

  if (!cause) return <div className="text-center py-20 text-xl font-heading tracking-widest text-gray-500 uppercase">Cause not found</div>;

  const progress = Math.min(100, Math.round((raised / cause.goalAmount) * 100)) || 0;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors uppercase text-xs font-bold tracking-widest">
        <ArrowLeft className="h-4 w-4" /> Back to Campaigns
      </Link>
      
      <div className="bg-[#1c1c1c] rounded-[40px] border border-[#2a2a2a] overflow-hidden shadow-2xl relative">
        <div className="h-[400px] w-full relative">
          <img 
            src={cause.imageUrl || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0'} 
            alt={cause.title} 
            className="w-full h-full object-cover grayscale opacity-70"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-[#1c1c1c]/60 to-transparent"></div>
          <div className="absolute bottom-10 left-10 right-10">
            <div className="inline-flex items-center gap-2 bg-[#2a2a2a]/80 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-[#333]">
              <UserIcon className="h-4 w-4 text-[#a4e857]" />
              <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">{cause.createdBy?.name || 'NGO'}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-heading text-white uppercase tracking-wider leading-none mb-0">{cause.title}</h1>
          </div>
        </div>

        <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-2xl font-heading text-gray-300 tracking-widest mb-6 uppercase">Mission</h2>
              <p className="text-gray-400 leading-relaxed whitespace-pre-wrap text-lg">
                {cause.description}
              </p>
            </div>
            
            <div className="w-full h-px bg-[#2a2a2a]"></div>
            
            <div>
              <h3 className="text-2xl font-heading text-gray-300 tracking-widest mb-6 uppercase flex items-center gap-3">
                <Heart className="h-5 w-5 text-[#ff9f31]" />
                Recent Supporters
              </h3>
              {donations.length > 0 ? (
                <div className="space-y-3">
                  {donations.slice(0, 5).map(don => (
                    <div key={don._id} className="flex items-center justify-between p-5 bg-[#111111] rounded-2xl border border-[#2a2a2a] hover:border-[#444] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-[#2a2a2a] text-[#a4e857] p-3 rounded-full">
                          <Heart className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-lg">{don.donorName}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-mono">
                            <Clock className="h-3 w-3" /> 
                            {new Date(don.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="font-heading text-2xl tracking-widest text-[#a4e857]">₹{don.amount}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#111111] border border-[#2a2a2a] p-8 rounded-2xl text-center">
                  <p className="text-gray-500 uppercase tracking-widest text-sm font-bold">Be the first to support this mission.</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#a4e857] opacity-10 rounded-full blur-3xl"></div>
              
              <div className="mb-8 relative z-10">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Total Raised</p>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-6xl font-heading text-[#a4e857] leading-none">₹{raised.toLocaleString()}</span>
                </div>
                <p className="text-gray-400 text-sm mb-6 flex justify-between">
                  <span>Target:</span> 
                  <span className="font-bold text-white">₹{cause.goalAmount.toLocaleString()}</span>
                </p>
                
                <div className="w-full bg-[#2a2a2a] rounded-full h-2 mb-3 overflow-hidden">
                  <div 
                    className="bg-[#a4e857] h-full rounded-full transition-all duration-1000 ease-out relative" 
                    style={{ width: `${progress}%` }}
                  >
                  </div>
                </div>
                <p className="text-right text-xs font-bold text-[#a4e857]">{progress}% FUNDED</p>
              </div>

              <Link 
                to={`/donate/${cause._id}`}
                className="w-full flex items-center justify-center gap-2 bg-[#a4e857] text-[#111111] py-4 rounded-full font-bold hover:bg-[#90d646] transition-all uppercase tracking-widest text-sm mb-4"
              >
                <Heart className="h-5 w-5 fill-current" />
                Contribute
              </Link>
              
              <button 
                onClick={handleFlag}
                disabled={flagged}
                className="w-full flex items-center justify-center gap-2 text-gray-500 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:text-red-500 hover:bg-[#2a2a2a] transition-colors disabled:opacity-50 border border-transparent hover:border-red-500/30"
              >
                <Flag className="h-4 w-4" />
                {flagged ? 'Flagged for Review' : 'Report Issue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
