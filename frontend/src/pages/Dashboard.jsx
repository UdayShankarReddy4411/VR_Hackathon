import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { Plus, Trash2, Edit2, TrendingUp, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', goalAmount: '', imageUrl: '', id: null });
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!token) {
      navigate('/ngo/login');
      return;
    }
    fetchCauses();
  }, [token, navigate]);

  const fetchCauses = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('/api/causes/me', config);
      const myCauses = res.data;
      
      const causesWithDonations = await Promise.all(
        myCauses.map(async (cause) => {
          try {
            const donRes = await axios.get(`/api/donations/${cause._id}`);
            return { ...cause, raisedAmount: donRes.data.raisedAmount };
          } catch (err) {
            return { ...cause, raisedAmount: 0 };
          }
        })
      );

      setCauses(causesWithDonations);
    } catch (error) {
      console.error('Error fetching causes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        title: formData.title,
        description: formData.description,
        goalAmount: Number(formData.goalAmount),
        imageUrl: formData.imageUrl
      };

      if (isEditing) {
        await axios.put(`/api/causes/${formData.id}`, payload, config);
      } else {
        await axios.post('/api/causes', payload, config);
      }

      setFormData({ title: '', description: '', goalAmount: '', imageUrl: '', id: null });
      setIsEditing(false);
      fetchCauses();
    } catch (error) {
      console.error('Error saving cause:', error);
      alert('Failed to save cause');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cause? All associated donations will also be removed.')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/causes/${id}`, config);
      fetchCauses();
    } catch (error) {
      console.error('Error deleting cause:', error);
      alert('Failed to delete cause');
    }
  };

  const handleEdit = (cause) => {
    setFormData({
      title: cause.title,
      description: cause.description,
      goalAmount: cause.goalAmount,
      imageUrl: cause.imageUrl,
      id: cause._id
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="flex h-full items-center justify-center animate-pulse text-gray-500">Loading your dashboard...</div>;

  const totalRaisedOverall = causes.reduce((sum, cause) => sum + (cause.raisedAmount || 0), 0);
  const totalGoalOverall = causes.reduce((sum, cause) => sum + (cause.goalAmount || 0), 0);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-heading tracking-wider mb-1 uppercase">NGO DASHBOARD</h1>
          <p className="text-gray-400 text-sm">Overview for {user?.name}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#1c1c1c] px-4 py-2 rounded-full border border-[#2a2a2a] text-sm flex items-center gap-2">
            <span className="text-gray-400">Total Causes:</span>
            <span className="font-bold">{causes.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#1c1c1c] rounded-3xl p-6 border border-[#2a2a2a] flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#a4e857] opacity-10 rounded-full blur-2xl"></div>
          <div>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-heading tracking-widest text-gray-400">TOTAL RAISED</h2>
              <TrendingUp className="h-5 w-5 text-[#a4e857]" />
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl md:text-5xl font-bold">₹{totalRaisedOverall.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-8">
             <div className="w-full h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
                <div className="h-full bg-[#a4e857]" style={{ width: `${Math.min(100, (totalRaisedOverall/totalGoalOverall)*100 || 0)}%` }}></div>
             </div>
          </div>
        </div>

        <div className="bg-[#1c1c1c] rounded-3xl p-6 border border-[#2a2a2a] flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#ff9f31] opacity-10 rounded-full blur-2xl"></div>
          <div>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-heading tracking-widest text-gray-400">TOTAL GOAL</h2>
              <DollarSign className="h-5 w-5 text-[#ff9f31]" />
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl md:text-5xl font-bold text-white">₹{totalGoalOverall.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-4 text-sm text-gray-400">
             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#ff9f31]"></div> TARGET</div>
          </div>
        </div>

        <div className="bg-[#1c1c1c] rounded-3xl p-6 border border-[#2a2a2a] shadow-2xl row-span-2">
          <h2 className="text-xl font-heading tracking-widest text-gray-400 mb-6 uppercase">
            {isEditing ? 'EDIT CAUSE' : 'NEW CAUSE'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Title</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-[#111111] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-[#a4e857] text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Description</label>
              <textarea required rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-[#111111] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-[#a4e857] text-white resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Goal Amount (₹)</label>
              <input type="number" required min="1" value={formData.goalAmount} onChange={(e) => setFormData({...formData, goalAmount: e.target.value})} className="w-full px-4 py-3 bg-[#111111] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-[#a4e857] text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Image URL</label>
              <input type="url" required value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-4 py-3 bg-[#111111] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-[#a4e857] text-white" />
            </div>
            <div className="pt-4 flex gap-3">
              <button type="submit" className="flex-1 bg-[#a4e857] text-[#111111] py-3 rounded-xl font-bold hover:bg-[#90d646] transition-colors uppercase tracking-wide text-sm">
                {isEditing ? 'UPDATE' : 'PUBLISH'}
              </button>
              {isEditing && (
                <button type="button" onClick={() => { setIsEditing(false); setFormData({ title: '', description: '', goalAmount: '', imageUrl: '', id: null }); }} className="px-4 bg-[#2a2a2a] text-white font-bold rounded-xl hover:bg-[#333] transition-colors uppercase tracking-wide text-sm">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="col-span-1 lg:col-span-2 bg-[#1c1c1c] rounded-3xl p-6 border border-[#2a2a2a] shadow-2xl h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading tracking-widest text-gray-400 uppercase">ACTIVE CAMPAIGNS</h2>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {causes.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No campaigns yet.</div>
            ) : (
              causes.map((cause) => {
                const progress = Math.min(100, Math.round((cause.raisedAmount / cause.goalAmount) * 100)) || 0;
                return (
                  <div key={cause._id} className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:border-[#444] transition-colors">
                    <div className="w-full sm:w-32 h-40 sm:h-24 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                      <img src={cause.imageUrl} alt={cause.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg leading-tight mb-1">{cause.title}</h3>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cause.status === 'approved' ? 'bg-[#a4e857]/20 text-[#a4e857]' : 'bg-[#ff9f31]/20 text-[#ff9f31]'}`}>
                            {cause.status || 'PENDING'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(cause)} className="w-8 h-8 rounded-full bg-[#2a2a2a] hover:bg-[#a4e857] hover:text-[#111111] flex items-center justify-center transition-colors text-gray-400">
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button onClick={() => handleDelete(cause._id)} className="w-8 h-8 rounded-full bg-[#2a2a2a] hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors text-gray-400">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex-1">
                          <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                            <div className="h-full bg-[#a4e857]" style={{ width: `${progress}%` }}></div>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-gray-400 whitespace-nowrap">
                          <span className="text-[#a4e857]">₹{cause.raisedAmount?.toLocaleString() || 0}</span> / ₹{cause.goalAmount?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
