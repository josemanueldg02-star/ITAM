import { useState } from 'react';
import Sidebar from './components/Sidebar';
import AssetList from './components/AssetList';

function App() {
  // Estado que controla qué pantalla estamos viendo. Empezamos en 'activos' por defecto.
  const [currentView, setCurrentView] = useState('activos');

  return (
    <div className="flex h-screen bg-darker">
      {/* Le pasamos el estado y la función para cambiarlo al Sidebar */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 p-10 overflow-y-auto">
         
         {/* VISTA 1: DASHBOARD */}
         {currentView === 'dashboard' && (
           <div className="bg-card p-10 rounded-xl shadow-lg border border-gray-800 text-center max-w-2xl mx-auto mt-20">
            <h1 className="text-4xl font-bold text-primary mb-4 tracking-wider">
              ITAM Dashboard
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              Resumen ejecutivo del inventario.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-darker p-4 rounded-lg border border-gray-700">
                <h3 className="text-gray-400 text-sm">Total Activos</h3>
                <p className="text-2xl font-bold text-white mt-1">2</p>
              </div>
              <div className="bg-darker p-4 rounded-lg border border-gray-700">
                <h3 className="text-gray-400 text-sm">Disponibles</h3>
                <p className="text-2xl font-bold text-primary mt-1">1</p>
              </div>
              <div className="bg-darker p-4 rounded-lg border border-gray-700">
                <h3 className="text-gray-400 text-sm">En Reparación</h3>
                <p className="text-2xl font-bold text-red-400 mt-1">0</p>
              </div>
            </div>
          </div>
         )}

         {/* VISTA 2: ACTIVOS */}
         {currentView === 'activos' && <AssetList />}

         {/* VISTA 3: EMPLEADOS */}
         {currentView === 'empleados' && (
           <div className="bg-card p-8 rounded-xl shadow-lg border border-gray-800">
             <h2 className="text-2xl font-bold text-white mb-6">Directorio de Empleados</h2>
             <div className="p-8 border-2 border-dashed border-gray-700 rounded-lg text-center">
                <p className="text-gray-500">
                  Próximamente conectaremos esta vista con el endpoint /api/employees de Spring Boot para ver a María López.
                </p>
             </div>
           </div>
         )}

      </main>
    </div>
  )
}

export default App;