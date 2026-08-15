// Recibimos las "props" desde el componente padre (App.jsx)
export default function Sidebar({ currentView, setCurrentView }) {
  
  // función para decidir el color del botón según si está activo o no
  const getButtonStyles = (viewName) => {
    const baseStyles = "text-left px-4 py-3 rounded-lg font-medium transition w-full ";
    if (currentView === viewName) {
      return baseStyles + "bg-gray-800 text-white"; // Estilo ACTIVO (Iluminado)
    }
    return baseStyles + "text-gray-400 hover:bg-gray-800/50 hover:text-white"; // Estilo INACTIVO
  };

  return (
    <aside className="w-64 bg-card border-r border-gray-800 h-screen p-6 flex flex-col">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-primary tracking-wider">ITAM</h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Portal Empresarial</p>
      </div>
      
      <nav className="flex flex-col gap-4">
        {/* Al hacer clic, le decimos al padre que cambie la vista a 'dashboard' */}
        <button 
          onClick={() => setCurrentView('dashboard')}
          className={getButtonStyles('dashboard')}
        >
          📊 Dashboard
        </button>
        
        <button 
          onClick={() => setCurrentView('activos')}
          className={getButtonStyles('activos')}
        >
          💻 Activos
        </button>
        
        <button 
          onClick={() => setCurrentView('empleados')}
          className={getButtonStyles('empleados')}
        >
          👥 Empleados
        </button>
      </nav>
    </aside>
  );
}