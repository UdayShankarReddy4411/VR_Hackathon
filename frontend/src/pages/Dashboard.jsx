import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash2, Edit2, BarChart3, Download } from 'lucide-react';

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
      const res = await axios.get('http://localhost:5000/api/causes/me', config);
      const myCauses = res.data;

      // Fetch donations for these causes
      const causesWithDonations = await Promise.all(
        myCauses.map(async (cause) => {
          try {
            const donRes = await axios.get(`http://localhost:5000/api/donations/${cause._id}`);
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
        await axios.put(`http://localhost:5000/api/causes/${formData.id}`, payload, config);
      } else {
        await axios.post('http://localhost:5000/api/causes', payload, config);
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
      await axios.delete(`http://localhost:5000/api/causes/${id}`, config);
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

  if (loading) return <div className="text-center py-20 animate-pulse text-gray-500">Loading your dashboard...</div>;

  const exportDonations = async () => {
    try {
      const allDonations = await Promise.all(
        causes.map(c => axios.get(`http://localhost:5000/api/donations/${c._id}`))
      );

      const flatDonations = [];
      allDonations.forEach((res, index) => {
        const causeDonations = res.data.donations.map(d => ({
          ...d,
          causeTitle: causes[index].title
        }));
        flatDonations.push(...causeDonations);
      });

      const csvHeader = "Donation ID,Donor Name,Amount,Status,Cause Title,Date\n";
      const csvRows = flatDonations.map(d =>
        `${d._id},"${d.donorName}",${d.amount},${d.status || 'active'},"${d.causeTitle}",${new Date(d.createdAt).toISOString()}`
      );

      const blob = new Blob([csvHeader + csvRows.join('\n')], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'my_donations.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      alert('Failed to export donations');
    }
  };

  const totalRaisedOverall = causes.reduce((sum, cause) => sum + (cause.raisedAmount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">NGO Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}. Here's an overview of your campaigns.</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-xl">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Funds Raised</p>
            <p className="text-2xl font-bold text-gray-900">${totalRaisedOverall.toLocaleString()}</p>
          </div>
          <button onClick={exportDonations} className="ml-4 flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              {isEditing ? <Edit2 className="h-5 w-5 text-indigo-600" /> : <Plus className="h-5 w-5 text-indigo-600" />}
              {isEditing ? 'Edit Cause' : 'Create New Cause'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Campaign Title"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Tell donors why this matters..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Goal Amount ($)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.goalAmount}
                    onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="10000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.imageUrl && (
                  <div className="mt-3 h-24 rounded-lg overflow-hidden border border-gray-200">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'; }} />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  {isEditing ? 'Update Cause' : 'Publish Cause'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ title: '', description: '', goalAmount: '', imageUrl: '', id: null });
                    }}
                    className="px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Your Active Campaigns</h2>
            </div>

            <div className="p-0">
              {causes.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No causes yet</h3>
                  <p className="text-gray-500">Create your first charitable campaign using the form.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {causes.map((cause) => {
                    const progress = Math.min(100, Math.round((cause.raisedAmount / cause.goalAmount) * 100)) || 0;
                    return (
                      <div key={cause._id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col sm:flex-row gap-6">
                          <div className="w-full sm:w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden relative">
                            <img src={cause.imageUrl} alt={cause.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0'; }} />
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-indigo-700">
                              {progress}% Funded
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-xl font-bold text-gray-900 truncate">{cause.title}</h3>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${cause.status === 'approved' ? 'bg-green-100 text-green-700' : cause.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                {cause.status?.toUpperCase() || 'PENDING'}
                              </span>
                            </div>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-4">{cause.description}</p>

                            <div className="flex items-center gap-6 mb-4">
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Raised</p>
                                <p className="font-bold text-indigo-600">${(cause.raisedAmount || 0).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Goal</p>
                                <p className="font-bold text-gray-700">${cause.goalAmount.toLocaleString()}</p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(cause)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-bold rounded-lg hover:bg-blue-100 transition-colors"
                              >
                                <Edit2 className="h-4 w-4" /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(cause._id)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-lg hover:bg-red-100 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
