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
    <div className="animate-in fade-in duration-500 w-full">
      {/* Hero Section with Full Background Image */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[600px] flex items-center justify-center mt-[-2rem] overflow-hidden">
        {/* Background Image and Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bg-hero.png')" }}
        ></div>
        <div className="absolute inset-0 z-10 bg-black/60"></div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <h3 className="text-[#f59e0b] text-xl md:text-2xl font-bold font-serif mb-4">
            Give a Hand to Make
          </h3>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 font-serif">
            Better life for all people
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-medium mb-10 max-w-2xl">
            Every good act is charity. A man's true wealth hereafter is the good that he does in this world to his fellows.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white py-16 border-b border-gray-100 mb-16 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-gray-700 leading-relaxed">
            We are Charity, Our Mission to <span className="text-[#f59e0b]">protect people, pets, and the planet,</span> Our activities are taken around the world.
          </h2>
        </div>
      </div>

      {/* Search and Causes */}
      <div className="w-full space-y-8 mb-16">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800 border-l-4 border-[#f59e0b] pl-4">Explore Causes</h2>
          
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#f59e0b] transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b] transition-all shadow-sm"
              placeholder="Search causes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
          
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white h-96 rounded-2xl animate-pulse shadow-sm"></div>
            ))}
          </div>
        ) : (
          <>
            {filteredCauses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCauses.map((cause) => (
                  <CauseCard key={cause._id} cause={cause} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-lg">No causes found matching your search.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
