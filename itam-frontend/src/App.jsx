import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar'; // <-- Importamos nuestro nuevo componente
import AssetList from './components/AssetList';
import EmployeeList from './components/EmployeeList';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import RequestList from './components/RequestList';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Función para cerrar sesión de forma segura
  const handleLogout = () => {
    localStorage.clear(); // Destruimos los pases VIP de la memoria
    setIsAuthenticated(false); // Cambiamos el estado para que React nos expulse a la pantalla de Login
    toast.success("Sesión cerrada correctamente", { icon: '👋' });
  };

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e1e1e', color: '#fff', border: '1px solid #374151' } }} />
        <Login onLoginSuccess={() => setIsAuthenticated(true)} />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-darker overflow-hidden">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: { background: '#1e1e1e', color: '#fff', border: '1px solid #374151' },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } }
        }} 
      />

      {/* Menú lateral izquierdo */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      {/* Contenedor derecho (Topbar + Contenido principal) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Barra superior con nuestro perfil */}
        <Topbar onLogout={handleLogout} />

        {/* Contenido dinámico */}
        <main className="flex-1 p-10 overflow-y-auto">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'activos' && <AssetList />}
          {currentView === 'empleados' && <EmployeeList />}
          {currentView === 'peticiones' && <RequestList />}
        </main>
        
      </div>
    </div>
  )
}

export default App;