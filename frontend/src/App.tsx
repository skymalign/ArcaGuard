import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardPage from './pages/DashboardPage';
import ClientesPage from './pages/ClientesPage';
import SegmentacionPage from './pages/SegmentacionPage';
import TerritoriosPage from './pages/TerritoriosPage';
import TendenciasPage from './pages/TendenciasPage';
import AccionesIaPage from './pages/AccionesIaPage';
import CentroVozPage from './pages/CentroVozPage';

const FULLSCREEN = ['acciones-ia', 'centro-voz'];

const TITLES: Record<string, { title: string }> = {
  dashboard:    { title: 'Dashboard' },
  segmentacion: { title: 'Segmentación' },
  territorios:  { title: 'Territorios' },
  tendencias:   { title: 'Tendencias' },
  clientes:     { title: 'Clientes' },
};

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const { title } = TITLES[activeNav] ?? TITLES.dashboard;

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-gray-50">
      <Sidebar active={activeNav} onSelect={setActiveNav} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {!FULLSCREEN.includes(activeNav) && <Topbar title={title} />}

        {activeNav === 'dashboard'    && <DashboardPage />}
        {activeNav === 'clientes'     && <ClientesPage />}
        {activeNav === 'segmentacion' && <SegmentacionPage />}
        {activeNav === 'territorios'  && <TerritoriosPage />}
        {activeNav === 'tendencias'   && <TendenciasPage />}
        {activeNav === 'acciones-ia'  && <AccionesIaPage onBack={() => setActiveNav('clientes')} />}
        {activeNav === 'centro-voz'   && <CentroVozPage  onBack={() => setActiveNav('clientes')} />}
      </div>
    </div>
  );
}