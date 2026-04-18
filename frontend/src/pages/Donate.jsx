import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api';
import { CheckCircle2, ArrowLeft, Heart } from 'lucide-react';

export default function Donate() {
  const { causeId } = useParams();
  const navigate = useNavigate();
  const [cause, setCause] = useState(null);
  
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get(`/api/causes/${causeId}`)
      .then(res => setCause(res.data))
      .catch(err => console.error(err));
  }, [causeId]);

  const predefinedAmounts = [10, 25, 50, 100, 500];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) return alert('Please enter a valid amount');
    
    setLoading(true);
    try {
      await axios.post('/api/donations', {
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
        <div className="bg-[#1c1c1c] p-12 rounded-[40px] shadow-2xl border border-[#a4e857]/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#a4e857]/5 backdrop-blur-3xl"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 bg-[#a4e857]/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#a4e857]/50">
              <CheckCircle2 className="h-12 w-12 text-[#a4e857]" />
            </div>
            <h2 className="text-5xl font-heading text-white mb-6 uppercase tracking-wider">Transaction<br/><span className="text-[#a4e857]">Successful</span></h2>
            <p className="text-gray-400 mb-10 text-lg">
              Your contribution of <span className="font-bold text-white">₹{amount}</span> has been processed. 
              Thank you for making a difference.
            </p>
            <button 
              onClick={() => navigate(`/cause/${causeId}`)}
              className="w-full bg-white text-[#111111] py-4 rounded-full font-bold hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm"
            >
              Return to Campaign
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-xs font-bold uppercase tracking-widest"
      >
        <ArrowLeft className="h-4 w-4" /> Go Back
      </button>

      <div className="bg-[#1c1c1c] rounded-[40px] shadow-2xl border border-[#2a2a2a] p-10 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#ff9f31] opacity-10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-[#2a2a2a] rounded-full mb-6 text-[#ff9f31]">
            <Heart className="h-8 w-8" />
          </div>
          <h1 className="text-5xl font-heading text-white mb-2 uppercase tracking-wider">Secure <span className="text-[#ff9f31]">Funding</span></h1>
          <p className="text-gray-400">
            Allocating resources to <span className="text-white font-bold">{cause?.title || 'this campaign'}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">Select Tier</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {predefinedAmounts.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={`py-4 rounded-2xl border font-bold transition-all text-lg ${
                    Number(amount) === preset 
                      ? 'border-[#ff9f31] bg-[#ff9f31]/10 text-[#ff9f31]' 
                      : 'border-[#2a2a2a] bg-[#111111] text-gray-400 hover:border-[#444] hover:text-white'
                  }`}
                >
                  ₹{preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Custom Amount (₹)</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-6 py-5 bg-[#111111] border border-[#2a2a2a] rounded-2xl focus:bg-[#151515] focus:outline-none focus:border-[#ff9f31] focus:ring-1 focus:ring-[#ff9f31] transition-colors text-2xl font-bold text-white placeholder-gray-700"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Display Name (Optional)</label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="w-full px-6 py-4 bg-[#111111] border border-[#2a2a2a] rounded-2xl focus:bg-[#151515] focus:outline-none focus:border-[#ff9f31] transition-colors text-white placeholder-gray-700"
              placeholder="Leave blank for anonymous"
            />
          </div>

          <div className="bg-[#2a2a2a]/50 text-gray-400 p-4 rounded-2xl text-xs uppercase tracking-wider text-center border border-[#333]">
            This is a simulated gateway. No actual transfer will occur.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff9f31] text-[#111111] py-5 rounded-full font-bold text-lg hover:bg-[#ffad52] transition-all disabled:opacity-50 uppercase tracking-widest shadow-lg shadow-[#ff9f31]/20 mt-4"
          >
            {loading ? 'Processing...' : `Authorize ₹${amount || '0'}`}
          </button>
        </form>
      </div>
    </div>
  );
}
