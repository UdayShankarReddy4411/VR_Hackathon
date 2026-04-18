import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

export default function Donate() {
  const { causeId } = useParams();
  const navigate = useNavigate();
  const [cause, setCause] = useState(null);
  
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/causes/${causeId}`)
      .then(res => setCause(res.data))
      .catch(err => console.error(err));
  }, [causeId]);

  const predefinedAmounts = [10, 25, 50, 100, 500];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) return alert('Please enter a valid amount');
    
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/donations', {
        causeId,
        amount: Number(amount),
        donorName: donorName || 'Anonymous'
      });
      setSuccess(true);
    } catch (error) {
      alert('Error processing donation');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center animate-in zoom-in duration-500">
        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-green-100 border border-green-50">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Your generous donation of <span className="font-bold text-gray-900">${amount}</span> has been processed successfully. 
            It will make a real difference.
          </p>
          <button 
            onClick={() => navigate(`/cause/${causeId}`)}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
          >
            Return to Cause
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-[#f59e0b] transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Secure Donation</h1>
        <p className="text-gray-500 mb-8">
          You are supporting <span className="font-bold text-gray-700">{cause?.title || 'this cause'}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Select Amount</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {predefinedAmounts.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={`py-3 rounded-xl border-2 font-bold transition-all ${
                    Number(amount) === preset 
                      ? 'border-[#f59e0b] bg-[#fffbeb] text-[#d97706]' 
                      : 'border-gray-100 text-gray-600 hover:border-orange-200 hover:bg-gray-50'
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Custom Amount ($)</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b] transition-colors text-lg font-medium"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Display Name (Optional)</label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b] transition-colors"
              placeholder="Leave blank to remain anonymous"
            />
          </div>

          <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100">
            This is a simulated payment gateway. No real charges will be made.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f59e0b] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#d97706] shadow-lg shadow-orange-200 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? 'Processing...' : `Donate $${amount || '0'}`}
          </button>
        </form>
      </div>
    </div>
  );
}
