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

const FULLSCREEN = ['tendencias', 'acciones-ia', 'centro-voz'];

const TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard:    { title: 'Dashboard',    subtitle: 'Monitoreo de Riesgo de Churn' },
  segmentacion: { title: 'Segmentación', subtitle: 'Análisis detallado del modelo predictivo' },
  territorios:  { title: 'Territorios',  subtitle: 'Distribución territorial del riesgo' },
  tendencias:   { title: 'Tendencias',   subtitle: 'Evolución del riesgo en el tiempo' },
  clientes:     { title: 'Clientes',     subtitle: 'Gestión y monitoreo de cartera' },
};

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const { title, subtitle } = TITLES[activeNav] ?? TITLES.dashboard;
  const [selectedClienteId, setSelectedClienteId] = useState<string | undefined>(); // To show AI recs

  const openPlanIA = (clienteId: string) => {
    setSelectedClienteId(clienteId);
    setActiveNav('acciones-ia');
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-gray-50">
      <Sidebar active={activeNav} onSelect={setActiveNav} />
      <div className="flex-1 flex flex-col min-w-0">
        {!FULLSCREEN.includes(activeNav) && <Topbar title={title} subtitle={subtitle} />}
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
