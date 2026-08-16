import { useState } from 'react';
import Sidebar from './components/Sidebar';
import AssetList from './components/AssetList';
import EmployeeList from './components/EmployeeList';
import Dashboard from './components/Dashboard'; // Importamos nuestro nuevo componente

function App() {
  // Ahora la vista por defecto al entrar será el dashboard
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="flex h-screen bg-darker">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 p-10 overflow-y-auto">
         
         {/* Renderizamos el componente correspondiente según el menú */}
         {currentView === 'dashboard' && <Dashboard />}
         {currentView === 'activos' && <AssetList />}
         {currentView === 'empleados' && <EmployeeList />}

      </main>
    </div>
  )
}

export default App;