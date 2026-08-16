import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import AssetList from './components/AssetList';
import EmployeeList from './components/EmployeeList';
import Dashboard from './components/Dashboard';
import Login from './components/Login'; // Importamos la nueva pantalla

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Al cargar la web, comprobamos si ya hay un token guardado (sesión activa)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Si no está autenticado, renderizamos ÚNICAMENTE la pantalla de Login
  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e1e1e', color: '#fff', border: '1px solid #374151' } }} />
        <Login onLoginSuccess={() => setIsAuthenticated(true)} />
      </>
    );
  }

  // Si está autenticado, renderizamos la aplicación completa
  return (
    <div className="flex h-screen bg-darker">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: { background: '#1e1e1e', color: '#fff', border: '1px solid #374151' },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } }
        }} 
      />

      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 p-10 overflow-y-auto">
         {currentView === 'dashboard' && <Dashboard />}
         {currentView === 'activos' && <AssetList />}
         {currentView === 'empleados' && <EmployeeList />}
      </main>
    </div>
  )
}

export default App;