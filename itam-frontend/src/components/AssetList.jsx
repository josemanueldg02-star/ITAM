import { useState, useEffect } from 'react';

export default function AssetList() {
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]); // Estado para guardar los empleados

  // Estados para el Modal de CREAR
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    status: 'DISPONIBLE'
  });

  // Estados para el Modal de ASIGNAR
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null); // Qué dispositivo vamos a asignar
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(''); // A quién se lo asignamos

  const fetchAssets = () => {
    fetch('http://localhost:8081/api/assets')
      .then(response => response.json())
      .then(data => setAssets(data))
      .catch(error => console.error("Error conectando con el backend:", error));
  };

  // Función para pedir los empleados al backend
  const fetchEmployees = () => {
    fetch('http://localhost:8081/api/employees')
      .then(response => response.json())
      .then(data => setEmployees(data))
      .catch(error => console.error("Error al pedir empleados:", error));
  };

  useEffect(() => {
    fetchAssets();
    fetchEmployees(); 
  }, []);

  // Lógica para CREAR activo
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8081/api/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(() => {
      setIsCreateModalOpen(false);
      setFormData({ name: '', serialNumber: '', status: 'DISPONIBLE' });
      fetchAssets();
    })
    .catch(error => console.error("Error al crear:", error));
  };

  // Lógica para abrir el modal de asignar
  const openAssignModal = (asset) => {
    setSelectedAsset(asset);
    setSelectedEmployeeId(''); 
    setIsAssignModalOpen(true);
  };

  // Lógica para ejecutar la ASIGNACIÓN (Petición PUT)
  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmployeeId) return; // Si no elige empleado, no hacemos nada

    // Llamamos a nuestro endpoint especial: /api/assets/{assetId}/assign/{employeeId}
    fetch(`http://localhost:8081/api/assets/${selectedAsset.id}/assign/${selectedEmployeeId}`, {
      method: 'PUT',
    })
    .then(response => response.json())
    .then(() => {
      setIsAssignModalOpen(false); // Cerramos el modal
      fetchAssets(); // Refrescamos la tabla (el activo pasará a estado ASIGNADO)
    })
    .catch(error => console.error("Error al asignar:", error));
  };

  return (
    <div className="bg-card p-8 rounded-xl shadow-lg border border-gray-800 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Inventario de Activos</h2>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary text-darker font-bold py-2 px-4 rounded hover:opacity-80 transition"
        >
          + Nuevo Activo
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-sm uppercase tracking-wider">
              <th className="pb-3 px-4">ID</th>
              <th className="pb-3 px-4">Nombre</th>
              <th className="pb-3 px-4">Número de Serie</th>
              <th className="pb-3 px-4">Estado</th>
              <th className="pb-3 px-4 text-right">Acciones</th> {/* NUEVA COLUMNA */}
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {assets.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  Cargando activos o inventario vacío...
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="py-4 px-4">#{asset.id}</td>
                  <td className="py-4 px-4 font-medium text-white">{asset.name}</td>
                  <td className="py-4 px-4 font-mono text-sm text-gray-400">{asset.serialNumber}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      asset.status === 'ASIGNADO' ? 'bg-accent/20 text-accent' : 
                      asset.status === 'DISPONIBLE' ? 'bg-blue-500/20 text-primary' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {/* NUEVO: El botón de asignar solo sale si está DISPONIBLE */}
                    {asset.status === 'DISPONIBLE' && (
                      <button 
                        onClick={() => openAssignModal(asset)}
                        className="bg-gray-700 hover:bg-primary hover:text-darker text-white text-xs font-bold py-1 px-3 rounded transition"
                      >
                        Asignar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: CREAR ACTIVO (El que ya teníamos) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-xl border border-gray-700 w-96 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Registrar Nuevo Activo</h3>
            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nombre del Dispositivo</label>
                <input 
                  type="text" required placeholder="Ej: Poco X8 Pro o iPad"
                  className="w-full bg-darker border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-primary transition"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Número de Serie</label>
                <input 
                  type="text" required placeholder="Ej: SN-2026-XYZ"
                  className="w-full bg-darker border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-primary transition"
                  value={formData.serialNumber} onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Estado Inicial</label>
                <select 
                  className="w-full bg-darker border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-primary transition"
                  value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="DISPONIBLE">DISPONIBLE</option>
                  <option value="EN REPARACIÓN">EN REPARACIÓN</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition font-medium">Cancelar</button>
                <button type="submit" className="bg-accent text-white font-bold py-2 px-6 rounded hover:opacity-80 transition shadow-lg">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NUEVO MODAL 2: ASIGNAR ACTIVO */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-xl border border-gray-700 w-96 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Asignar Equipo</h3>
            <p className="text-primary font-medium mb-6">{selectedAsset?.name} ({selectedAsset?.serialNumber})</p>
            
            <form onSubmit={handleAssignSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Seleccionar Empleado</label>
                <select 
                  required
                  className="w-full bg-darker border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-primary transition"
                  value={selectedEmployeeId} 
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                >
                  <option value="" disabled>-- Elige un empleado --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsAssignModalOpen(false)} 
                  className="px-4 py-2 text-gray-400 hover:text-white transition font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="bg-primary text-darker font-bold py-2 px-6 rounded hover:opacity-80 transition shadow-lg"
                >
                  Confirmar Asignación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}