interface TopbarProps {
  title: string;
}

export default function Topbar({ title}: TopbarProps) {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">{title}</h1>
      </div>
    </header>
  );
}
