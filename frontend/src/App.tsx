import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard');

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-gray-50">
      <Sidebar active={activeNav} onSelect={setActiveNav} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Dashboard" subtitle="Monitoreo de Riesgo de Churn" />
        <DashboardPage />
      </div>
    </div>
  );
}