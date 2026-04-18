import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CauseDetail from './pages/CauseDetail';
import Donate from './pages/Donate';
import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cause/:id" element={<CauseDetail />} />
            <Route path="/donate/:causeId" element={<Donate />} />
            <Route path="/ngo/login" element={<LoginRegister />} />
            <Route path="/ngo/dashboard" element={<Dashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500">
          <p>&copy; 2026 Charity Platform. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
