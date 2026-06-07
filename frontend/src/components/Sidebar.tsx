import {
  LayoutDashboard,
  BarChart2,
  MapPin,
  TrendingUp,
  Users,
  Sparkles,
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
  { id: 'acciones-ia',   label: 'Acciones IA',     Icon: Sparkles },
  { id: 'centro-voz',    label: 'Centro de Voz',   Icon: PhoneCall },
];

const NAV_EXPORT = [
  { id: 'exportaciones', label: 'Exportaciones',   Icon: Download },
];

export default function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="w-56 shrink-0 flex flex-col bg-brand-red text-white h-screen overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/20">
        <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M12 2L3 7v10l9 5 9-5V7L12 2zm0 2.2L19 8v8l-7 3.9L5 16V8l7-3.8z"/>
          </svg>
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

        <div className="pt-5 pb-1 px-3">
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

      {/* Footer nav */}
      <div className="px-3 pb-4 space-y-0.5">
        {NAV_EXPORT.map(({ id, label, Icon }) => (
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
        <div className="px-3 pt-3 text-[11px] text-white/40">
          Última actualización:<br />
          <span className="text-white/60">29 May 2025 10:30 AM</span>
        </div>
      </div>
    </aside>
  );
}
