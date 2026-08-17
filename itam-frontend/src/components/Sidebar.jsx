export default function Sidebar({ currentView, setCurrentView }) {
  // Leemos el rol para saber si le mostramos notificaciones pendientes al admin
  const isAdmin = localStorage.getItem('role') === 'ROLE_ADMIN';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'activos', label: 'Activos', icon: '💻' },
    { id: 'empleados', label: 'Empleados', icon: '👥' },
    { id: 'peticiones', label: 'Peticiones', icon: '📨' } // <-- NUEVO BOTÓN
  ];

  return (
    <div className="w-64 bg-card border-r border-gray-800 flex flex-col">
      <div className="p-8">
        <h1 className="text-3xl font-black text-primary tracking-tighter">ITAM</h1>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Portal Empresarial</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-8">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold transition-all ${
              currentView === item.id 
                ? 'bg-gray-800 text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-800/50 hover:text-gray-300'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}