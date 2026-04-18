import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { Users, AlertTriangle, CheckCircle, XCircle, Database, Download } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [causes, setCauses] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [token, navigate, user]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [usersRes, causesRes, donationsRes] = await Promise.all([
        axios.get('/api/admin/users', config),
        axios.get('/api/admin/causes', config),
        axios.get('/api/admin/donations', config)
      ]);
      setUsers(usersRes.data);
      setCauses(causesRes.data);
      setDonations(donationsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/users/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) { alert('Failed to update user status'); }
  };

  const updateCauseStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/causes/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) { alert('Failed to update cause status'); }
  };

  const updateDonationStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/donations/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) { alert('Failed to update donation status'); }
  };

  const exportLedger = () => {
    const csvHeader = "ID,Donor Name,Amount,Status,Cause Title,NGO,Date\n";
    const csvRows = donations.map(d => 
      `${d._id},"${d.donorName}",${d.amount},${d.status},"${d.causeId?.title || 'Deleted Cause'}","${d.causeId?.createdBy?.name || 'Unknown'}",${new Date(d.createdAt).toISOString()}`
    );
    const blob = new Blob([csvHeader + csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'donation_ledger.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) return <div className="flex h-full items-center justify-center animate-pulse text-gray-500">Loading Admin Dashboard...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-heading tracking-wider mb-1 uppercase">PLATFORM ADMINISTRATION</h1>
        <p className="text-gray-400 text-sm">Manage NGOs, moderate content, and oversee the platform ledger.</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab('users')} className={`px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'users' ? 'bg-[#a4e857] text-[#111111]' : 'bg-[#1c1c1c] text-gray-400 hover:bg-[#2a2a2a]'}`}>
          <Users className="h-4 w-4" /> NGOs
        </button>
        <button onClick={() => setActiveTab('causes')} className={`px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'causes' ? 'bg-[#ff9f31] text-[#111111]' : 'bg-[#1c1c1c] text-gray-400 hover:bg-[#2a2a2a]'}`}>
          <AlertTriangle className="h-4 w-4" /> Causes & Moderation
        </button>
        <button onClick={() => setActiveTab('donations')} className={`px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'donations' ? 'bg-white text-[#111111]' : 'bg-[#1c1c1c] text-gray-400 hover:bg-[#2a2a2a]'}`}>
          <Database className="h-4 w-4" /> Donation Ledger
        </button>
      </div>

      <div className="bg-[#1c1c1c] rounded-3xl shadow-2xl border border-[#2a2a2a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase tracking-wider bg-[#111111] text-gray-500 font-heading">
              {activeTab === 'users' && (
                <tr>
                  <th className="px-6 py-5">NGO Name</th>
                  <th className="px-6 py-5">Email</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              )}
              {activeTab === 'causes' && (
                <tr>
                  <th className="px-6 py-5">Title</th>
                  <th className="px-6 py-5">NGO</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              )}
              {activeTab === 'donations' && (
                <tr>
                  <th className="px-6 py-5">Donor</th>
                  <th className="px-6 py-5">Amount</th>
                  <th className="px-6 py-5">Cause</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">
                    <button onClick={exportLedger} className="inline-flex items-center gap-1 text-[#a4e857] hover:text-[#90d646] transition-colors uppercase">
                      <Download className="h-3 w-3" /> Export CSV
                    </button>
                  </th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {activeTab === 'users' && users.map(u => (
                <tr key={u._id} className="hover:bg-[#151515] transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.status === 'active' ? 'bg-[#a4e857]/20 text-[#a4e857]' : u.status === 'pending' ? 'bg-[#ff9f31]/20 text-[#ff9f31]' : 'bg-red-500/20 text-red-500'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    {u.status !== 'active' && <button onClick={() => updateUserStatus(u._id, 'active')} className="w-8 h-8 rounded-full bg-[#2a2a2a] text-[#a4e857] hover:bg-[#a4e857] hover:text-[#111111] flex items-center justify-center transition-colors"><CheckCircle className="h-4 w-4" /></button>}
                    {u.status !== 'suspended' && <button onClick={() => updateUserStatus(u._id, 'suspended')} className="w-8 h-8 rounded-full bg-[#2a2a2a] text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"><XCircle className="h-4 w-4" /></button>}
                  </td>
                </tr>
              ))}
              
              {activeTab === 'causes' && causes.map(c => (
                <tr key={c._id} className="hover:bg-[#151515] transition-colors">
                  <td className="px-6 py-4 font-bold text-white line-clamp-1">{c.title}</td>
                  <td className="px-6 py-4">{c.createdBy?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.status === 'approved' ? 'bg-[#a4e857]/20 text-[#a4e857]' : c.status === 'pending' ? 'bg-[#ff9f31]/20 text-[#ff9f31]' : 'bg-red-500/20 text-red-500'}`}>
                      {c.status}
                    </span>
                    {c.flags?.length > 0 && <span className="text-red-500 text-xs font-bold border border-red-500/50 px-2 py-0.5 rounded-full">{c.flags.length} Flags</span>}
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    {c.status !== 'approved' && <button onClick={() => updateCauseStatus(c._id, 'approved')} className="w-8 h-8 rounded-full bg-[#2a2a2a] text-[#a4e857] hover:bg-[#a4e857] hover:text-[#111111] flex items-center justify-center transition-colors"><CheckCircle className="h-4 w-4" /></button>}
                    {c.status !== 'rejected' && <button onClick={() => updateCauseStatus(c._id, 'rejected')} className="w-8 h-8 rounded-full bg-[#2a2a2a] text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"><XCircle className="h-4 w-4" /></button>}
                  </td>
                </tr>
              ))}

              {activeTab === 'donations' && donations.map(d => (
                <tr key={d._id} className="hover:bg-[#151515] transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{d.donorName}</td>
                  <td className="px-6 py-4 font-bold text-[#a4e857]">₹{d.amount}</td>
                  <td className="px-6 py-4 truncate max-w-xs">{d.causeId?.title || 'Unknown Cause'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${d.status === 'active' ? 'bg-[#a4e857]/20 text-[#a4e857]' : 'bg-[#2a2a2a] text-gray-400'}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {d.status === 'active' && (
                      <button onClick={() => updateDonationStatus(d._id, 'refunded')} className="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-wider">
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(activeTab === 'users' && users.length === 0) || 
           (activeTab === 'causes' && causes.length === 0) || 
           (activeTab === 'donations' && donations.length === 0) ? (
            <div className="text-center py-16 text-gray-500">No data found in this category.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
