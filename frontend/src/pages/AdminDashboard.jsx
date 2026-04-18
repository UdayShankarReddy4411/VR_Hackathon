import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
        axios.get('http://localhost:5000/api/admin/users', config),
        axios.get('http://localhost:5000/api/admin/causes', config),
        axios.get('http://localhost:5000/api/admin/donations', config)
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
      await axios.put(`http://localhost:5000/api/admin/users/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) { alert('Failed to update user status'); }
  };

  const updateCauseStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/causes/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) { alert('Failed to update cause status'); }
  };

  const updateDonationStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/donations/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
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

  if (loading) return <div className="text-center py-20 animate-pulse text-gray-500">Loading Admin Dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-orange-900 mb-2">Platform Administration</h1>
        <p className="text-gray-500">Manage NGOs, moderate content, and oversee the platform ledger.</p>
      </div>

      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button onClick={() => setActiveTab('users')} className={`pb-3 px-2 font-bold text-sm ${activeTab === 'users' ? 'border-b-2 border-[#f59e0b] text-[#f59e0b]' : 'text-gray-500 hover:text-gray-700'}`}>
          <Users className="inline h-4 w-4 mr-2" /> NGOs
        </button>
        <button onClick={() => setActiveTab('causes')} className={`pb-3 px-2 font-bold text-sm ${activeTab === 'causes' ? 'border-b-2 border-[#f59e0b] text-[#f59e0b]' : 'text-gray-500 hover:text-gray-700'}`}>
          <AlertTriangle className="inline h-4 w-4 mr-2" /> Causes & Moderation
        </button>
        <button onClick={() => setActiveTab('donations')} className={`pb-3 px-2 font-bold text-sm ${activeTab === 'donations' ? 'border-b-2 border-[#f59e0b] text-[#f59e0b]' : 'text-gray-500 hover:text-gray-700'}`}>
          <Database className="inline h-4 w-4 mr-2" /> Donation Ledger
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">NGO Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="bg-white border-b border-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.status === 'active' ? 'bg-green-100 text-green-700' : u.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {u.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {u.status !== 'active' && <button onClick={() => updateUserStatus(u._id, 'active')} className="text-green-600 hover:text-green-800"><CheckCircle className="h-5 w-5" /></button>}
                    {u.status !== 'suspended' && <button onClick={() => updateUserStatus(u._id, 'suspended')} className="text-red-600 hover:text-red-800"><XCircle className="h-5 w-5" /></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'causes' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">NGO</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Flags</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {causes.map(c => (
                <tr key={c._id} className="bg-white border-b border-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 line-clamp-1">{c.title}</td>
                  <td className="px-6 py-4">{c.createdBy?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${c.status === 'approved' ? 'bg-green-100 text-green-700' : c.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {c.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {c.flags?.length > 0 ? <span className="text-red-600 font-bold">{c.flags.length} Flags</span> : 'None'}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {c.status !== 'approved' && <button onClick={() => updateCauseStatus(c._id, 'approved')} className="text-green-600 hover:text-green-800"><CheckCircle className="h-5 w-5" /></button>}
                    {c.status !== 'rejected' && <button onClick={() => updateCauseStatus(c._id, 'rejected')} className="text-yellow-600 hover:text-yellow-800"><XCircle className="h-5 w-5" /></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'donations' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={exportLedger} className="flex items-center gap-2 bg-[#f59e0b] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#d97706] shadow-sm transition-colors">
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-4">Donor</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Cause</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(d => (
                  <tr key={d._id} className="bg-white border-b border-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{d.donorName}</td>
                    <td className="px-6 py-4 font-bold text-[#f59e0b]">${d.amount}</td>
                    <td className="px-6 py-4 truncate max-w-xs">{d.causeId?.title || 'Unknown Cause'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${d.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {d.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {d.status === 'active' && (
                        <button onClick={() => updateDonationStatus(d._id, 'refunded')} className="text-sm font-bold text-red-600 hover:underline">
                          Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
