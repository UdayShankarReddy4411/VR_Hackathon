import { useState, useEffect } from 'react';
import axios from '../api';
import { Search } from 'lucide-react';
import CauseCard from '../components/CauseCard';

export default function Home() {
  const [causes, setCauses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCauses = async () => {
      try {
        const response = await axios.get('/api/causes');
        
        const causesWithDonations = await Promise.all(
          response.data.map(async (cause) => {
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
    fetchCauses();
  }, []);

  const filteredCauses = causes.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-[#1c1c1c] rounded-[40px] border border-[#2a2a2a] p-12 mb-12 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#a4e857] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#ff9f31] opacity-10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-heading text-white mb-6 uppercase tracking-wider leading-none">
            Empower <span className="text-[#a4e857]">Change.</span><br/>
            Fund <span className="text-[#ff9f31]">Hope.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-xl">
            Discover verified charitable campaigns. Your contribution directly impacts communities worldwide.
          </p>
          
          <div className="max-w-md relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500 group-focus-within:text-[#a4e857] transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-14 pr-6 py-4 bg-[#111111] border border-[#2a2a2a] rounded-full leading-5 text-white placeholder-gray-500 focus:outline-none focus:border-[#a4e857] focus:ring-1 focus:ring-[#a4e857] transition-all"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-heading tracking-widest text-gray-300 uppercase">Explore Campaigns</h2>
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] px-4 py-1.5 rounded-full text-sm font-bold text-[#a4e857]">
            {filteredCauses.length} Results
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#1c1c1c] h-96 rounded-3xl animate-pulse border border-[#2a2a2a]"></div>
            ))}
          </div>
        ) : (
          <div className="pb-8">
            {filteredCauses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCauses.map((cause) => (
                  <CauseCard key={cause._id} cause={cause} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#1c1c1c] rounded-3xl border border-[#2a2a2a]">
                <p className="text-gray-500 text-lg">No campaigns found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
