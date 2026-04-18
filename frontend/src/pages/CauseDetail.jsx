import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, Clock, User as UserIcon, Flag } from 'lucide-react';

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
          axios.get(`http://localhost:5000/api/causes/${id}`),
          axios.get(`http://localhost:5000/api/donations/${id}`)
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
      await axios.post(`http://localhost:5000/api/causes/${id}/flag`, { reason: 'Suspicious content reported by user' });
      setFlagged(true);
      alert('This cause has been flagged for admin review.');
    } catch (err) {
      alert('Failed to flag cause');
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-white h-[600px] rounded-3xl"></div>;
  }

  if (!cause) return <div className="text-center py-20 text-xl font-medium text-gray-500">Cause not found</div>;

  const progress = Math.min(100, Math.round((raised / cause.goalAmount) * 100)) || 0;

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-80 w-full relative">
          <img 
            src={cause.imageUrl || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0'} 
            alt={cause.title} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">{cause.title}</h1>
            <p className="text-indigo-200 flex items-center gap-2 text-sm font-medium">
              <UserIcon className="h-4 w-4" /> By {cause.createdBy?.name || 'NGO'}
            </p>
          </div>
        </div>

        <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this cause</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg">
                {cause.description}
              </p>
            </div>
            
            <hr className="border-gray-100" />
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Donations</h3>
              {donations.length > 0 ? (
                <div className="space-y-4">
                  {donations.slice(0, 5).map(don => (
                    <div key={don._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full">
                          <Heart className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{don.donorName}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" /> 
                            {new Date(don.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-indigo-600 text-lg">${don.amount}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 bg-gray-50 p-6 rounded-xl text-center">Be the first to donate to this cause!</p>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="sticky top-6 bg-white border border-gray-100 rounded-2xl p-6 shadow-xl shadow-indigo-100/20">
              <div className="mb-6">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-extrabold text-indigo-600">${raised.toLocaleString()}</span>
                  <span className="text-gray-500 font-medium mb-1">raised</span>
                </div>
                <p className="text-gray-500 text-sm mb-4">of ${cause.goalAmount.toLocaleString()} goal</p>
                
                <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out relative" 
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-right text-xs font-bold text-indigo-600">{progress}%</p>
              </div>

              <Link 
                to={`/donate/${cause._id}`}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all hover:-translate-y-1"
              >
                <Heart className="h-5 w-5 fill-current" />
                Donate Now
              </Link>
              
              <button 
                onClick={handleFlag}
                disabled={flagged}
                className="w-full mt-4 flex items-center justify-center gap-2 text-gray-500 py-2 rounded-xl text-sm font-medium hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <Flag className="h-4 w-4" />
                {flagged ? 'Flagged for Review' : 'Report as Suspicious'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
