import arcaLogo from '../assets/arcaLogo.png'
import {
  LayoutDashboard,
  BarChart2,
  MapPin,
  TrendingUp,
  Users,
  PhoneCall,
  Download,
} from 'lucide-react';

interface SidebarProps {
  active: string;
  onSelect: (item: string) => void;
}

const NAV_MAIN = [
  { id: 'dashboard',     label: 'Dashboard',       Icon: LayoutDashboard },
  { id: 'segmentacion',  label: 'Segmentación',    Icon: BarChart2 },
  { id: 'territorios',   label: 'Territorios',     Icon: MapPin },
  { id: 'tendencias',    label: 'Tendencias',      Icon: TrendingUp },
  { id: 'clientes',      label: 'Clientes',        Icon: Users },
];

const NAV_IA = [
  { id: 'centro-voz',    label: 'Centro de Voz',   Icon: PhoneCall },
];

export default function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="w-56 shrink-0 flex flex-col bg-brand-red text-white h-screen overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/20">
        <div className="w-8 h-8 bg-white/50 rounded-md flex items-center justify-center overflow-hidden">
          <img
            src={arcaLogo}
            alt="Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-bold tracking-wide text-sm uppercase">Arca Continental</span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 pt-4 space-y-0.5">
        {NAV_MAIN.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              active === id
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}

        <div className="pt-8 pb-1 px-3">
          <span className="text-xs uppercase tracking-widest text-white/40 font-semibold">IA</span>
        </div>

        {NAV_IA.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              active === id
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>

      {/* Footer: descarga del submission */}
      <div className="px-3 pb-4 space-y-0.5">
        <a
          href="/preds_submission.csv"
          download="preds_submission.csv"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          <Download size={17} className="shrink-0" />
          <span className="flex flex-col leading-tight">
            Exportar predicciones
            <span className="text-[10px] text-white/40 font-normal">submission .csv · 199,923</span>
          </span>
        </a>
        
      </div>
    </aside>
  );
}
