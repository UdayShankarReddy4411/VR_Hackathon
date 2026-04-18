import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import CauseCard from '../components/CauseCard';

export default function Home() {
  const [causes, setCauses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCauses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/causes');
        
        // We also need to fetch raised amount for each cause to display on cards
        // For efficiency, usually we'd aggregate in backend. For this 6-hour build, 
        // we'll fetch donations concurrently or modify backend. 
        // Let's assume we do concurrent fetches for now
        const causesWithDonations = await Promise.all(
          response.data.map(async (cause) => {
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
    fetchCauses();
  }, []);

  const filteredCauses = causes.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center py-12 px-4 bg-gradient-to-br from-indigo-50 to-white rounded-3xl border border-indigo-100 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4 tracking-tight">
          Make a Difference Today
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Browse through our verified charitable causes and support the ones that matter to you. Every donation counts.
        </p>
        
        <div className="max-w-md mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
            placeholder="Search causes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white h-96 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Explore Causes</h2>
            <span className="text-gray-500 text-sm font-medium">{filteredCauses.length} found</span>
          </div>
          
          {filteredCauses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCauses.map((cause) => (
                <CauseCard key={cause._id} cause={cause} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500 text-lg">No causes found matching your search.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
