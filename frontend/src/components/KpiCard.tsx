import { Users, AlertTriangle, Target } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  variant: 'default' | 'warning' | 'success';
}

const ICONS = {
  default: Users,
  warning: AlertTriangle,
  success: Target,
};

const ICON_STYLES = {
  default: 'text-gray-500',
  warning: 'text-amber-500',
  success: 'text-green-500',
};

export default function KpiCard({ title, value, subtitle, variant }: KpiCardProps) {
  const Icon = ICONS[variant];
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-2 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
        <Icon size={16} className={ICON_STYLES[variant]} />
        {title}
      </div>
      <div className="text-4xl font-bold text-gray-900 tracking-tight">{value}</div>
      <div className="text-sm text-gray-400">{subtitle}</div>
    </div>
  );
}
