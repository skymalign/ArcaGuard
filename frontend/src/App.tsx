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
  const { title} = TITLES[activeNav] ?? TITLES.dashboard;
  const [selectedClienteId, setSelectedClienteId] = useState<string | undefined>(); // To show AI recs

  const openPlanIA = (clienteId: string) => {
    setSelectedClienteId(clienteId);
    setActiveNav('acciones-ia');
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-gray-50">
      <Sidebar active={activeNav} onSelect={setActiveNav} />
      <div className="flex-1 flex flex-col min-w-0">
        {!FULLSCREEN.includes(activeNav) && <Topbar title={title}/>}
        {activeNav === 'dashboard' && <DashboardPage />}
        {activeNav === 'clientes' && (
          <ClientesPage onPlanIA={openPlanIA} />
        )}
        {activeNav === 'segmentacion' && <SegmentacionPage />}
        {activeNav === 'territorios' && <TerritoriosPage />}
        {activeNav === 'tendencias' && <TendenciasPage />}

        {/* To show ai for specific person */}
        {activeNav === 'acciones-ia' && (
          <AccionesIaPage
            clienteId={selectedClienteId}
            onBack={() => setActiveNav('clientes')}
          />
        )}
        {activeNav === 'centro-voz' && <CentroVozPage onBack={() => setActiveNav('clientes')} />}
      </div>
    </div>
  );
}