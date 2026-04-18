import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Home from './pages/Home';
import CauseDetail from './pages/CauseDetail';
import Donate from './pages/Donate';
import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex text-white font-sans overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen relative pb-16 md:pb-0">
          <TopNav />
          <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 relative z-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cause/:id" element={<CauseDetail />} />
              <Route path="/donate/:causeId" element={<Donate />} />
              <Route path="/ngo/login" element={<LoginRegister />} />
              <Route path="/ngo/dashboard" element={<Dashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
