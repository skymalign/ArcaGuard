import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardPage from './pages/DashboardPage';
import ClientesPage from './pages/ClientesPage';
import SegmentacionPage from './pages/SegmentacionPage';
import TerritoriosPage from './pages/TerritoriosPage';

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard');

  const getTitle = () => {
    if (activeNav === 'clientes') return { title: 'Clientes', subtitle: 'Gestión y monitoreo de cartera' };
    return { title: 'Dashboard', subtitle: 'Monitoreo de Riesgo de Churn' };
  };

  const { title, subtitle } = getTitle();

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-gray-50">
      <Sidebar active={activeNav} onSelect={setActiveNav} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} subtitle={subtitle} />
        {activeNav === 'dashboard' && <DashboardPage />}
        {activeNav === 'clientes' && <ClientesPage />}
        {activeNav === 'segmentacion' && <SegmentacionPage />}
        {activeNav === 'territorios' && <TerritoriosPage />}
      </div>
    </div>
  );
}