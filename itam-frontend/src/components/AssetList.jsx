import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AssetList() {
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', serialNumber: '', status: 'DISPONIBLE' });

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  // NUEVO: Modal para cuando un empleado solicita un equipo
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // MAGIA RBAC: Leemos quién es el usuario y su pase VIP
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const isAdmin = role === 'ROLE_ADMIN';

  // Preparamos la cabecera de seguridad para adjuntarla a las peticiones
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const fetchAssets = () => {
    fetch('http://localhost:8081/api/assets', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setAssets(data))
      .catch(() => toast.error("Error al cargar los activos"));
  };

  const fetchEmployees = () => {
    fetch('http://localhost:8081/api/employees', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchAssets();
    fetchEmployees();
  }, []);

  // --- MÉTODOS DE ADMINISTRADOR ---
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8081/api/assets', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(formData),
    })
    .then(res => res.json())
    .then(() => {
      setIsCreateModalOpen(false);
      setFormData({ name: '', serialNumber: '', status: 'DISPONIBLE' });
      fetchAssets();
      toast.success('Activo registrado correctamente');
    })
    .catch(() => toast.error("Error al guardar el activo"));
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmployeeId) return;
    fetch(`http://localhost:8081/api/assets/${selectedAsset.id}/assign/${selectedEmployeeId}`, {
      method: 'PUT',
      headers: authHeaders,
    })
    .then(() => {
      setIsAssignModalOpen(false);
      fetchAssets();
      toast.success('Equipo asignado al empleado');
    })
    .catch(() => toast.error("Error al asignar el equipo"));
  };

  const handleUnassign = (assetId) => {
    if(!window.confirm("¿Estás seguro de que quieres devolver este equipo al inventario?")) return;
    fetch(`http://localhost:8081/api/assets/${assetId}/unassign?newStatus=DISPONIBLE`, {
      method: 'PUT',
      headers: authHeaders,
    })
    .then(() => {
      fetchAssets();
      toast.success('Equipo recuperado y disponible');
    })
    .catch(() => toast.error("Error al desasignar el equipo"));
  };

  const handleStatusChange = (assetId, newStatus) => {
    const isRepairing = newStatus === 'EN REPARACIÓN';
    if(!window.confirm(isRepairing ? "¿Mandar este equipo a reparación?" : "¿Marcar este equipo como reparado?")) return;
    
    fetch(`http://localhost:8081/api/assets/${assetId}/status?newStatus=${newStatus}`, {
      method: 'PUT',
      headers: authHeaders,
    })
    .then(() => {
      fetchAssets();
      toast.success(isRepairing ? 'Equipo enviado a reparación 🛠️' : 'Equipo listo y disponible ✅');
    })
    .catch(() => toast.error("Error al actualizar el estado"));
  };

  // --- NUEVO: MÉTODO DE EMPLEADO (Usuario normal) ---
  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmployeeId) return;

    fetch('http://localhost:8081/api/requests', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ assetId: selectedAsset.id, employeeId: selectedEmployeeId })
    })
    .then(res => {
      if(!res.ok) throw new Error();
      return res.json();
    })
    .then(() => {
      setIsRequestModalOpen(false);
      toast.success('Petición enviada al administrador 📨');
    })
    .catch(() => toast.error("Error al enviar la petición"));
  };

  return (
    <div className="bg-card p-8 rounded-xl shadow-lg border border-gray-800 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Inventario de Activos</h2>
        
        {/* Solo el Admin puede ver el botón de crear nuevos activos */}
        {isAdmin && (
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary text-darker font-bold py-2 px-4 rounded hover:opacity-80 transition"
          >
            + Nuevo Activo
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-sm uppercase tracking-wider">
              <th className="pb-3 px-4 text-center w-16">ID</th>
              <th className="pb-3 px-4">Nombre</th>
              <th className="pb-3 px-4">Número de Serie</th>
              <th className="pb-3 px-4 text-center">Estado</th>
              <th className="pb-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {assets.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8 text-gray-500">Inventario vacío...</td></tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="py-4 px-4 text-center">#{asset.id}</td>
                  <td className="py-4 px-4 font-medium text-white">{asset.name}</td>
                  <td className="py-4 px-4 font-mono text-sm text-gray-400">{asset.serialNumber}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      asset.status === 'ASIGNADO' ? 'bg-accent/20 text-accent' : 
                      asset.status === 'DISPONIBLE' ? 'bg-blue-500/20 text-primary' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center items-center gap-2">
                      
                      {/* BOTONES EXCLUSIVOS DE ADMINISTRADOR */}
                      {isAdmin && (
                        <>
                          {asset.status === 'DISPONIBLE' && (
                            <button onClick={() => { setSelectedAsset(asset); setIsAssignModalOpen(true); }} className="bg-gray-700 hover:bg-primary hover:text-darker text-white text-xs font-bold py-1 px-3 rounded transition">Asignar</button>
                          )}
                          {asset.status === 'ASIGNADO' && (
                            <button onClick={() => handleUnassign(asset.id)} className="bg-gray-700 hover:bg-red-500 hover:text-white text-white text-xs font-bold py-1 px-3 rounded transition">Desasignar</button>
                          )}
                          {asset.status !== 'EN REPARACIÓN' && (
                            <button onClick={() => handleStatusChange(asset.id, 'EN REPARACIÓN')} className="bg-gray-700 hover:bg-orange-500 hover:text-white text-white text-xs font-bold py-1 px-3 rounded transition">Reparar</button>
                          )}
                          {asset.status === 'EN REPARACIÓN' && (
                            <button onClick={() => handleStatusChange(asset.id, 'DISPONIBLE')} className="bg-gray-700 hover:bg-blue-500 hover:text-white text-white text-xs font-bold py-1 px-3 rounded transition">Recuperar</button>
                          )}
                        </>
                      )}

                      {/* BOTONES EXCLUSIVOS DE EMPLEADO (ROLE_USER) */}
                      {!isAdmin && asset.status === 'DISPONIBLE' && (
                        <button onClick={() => { setSelectedAsset(asset); setIsRequestModalOpen(true); }} className="bg-primary text-darker text-xs font-bold py-1 px-3 rounded hover:opacity-80 transition shadow-lg">
                          Solicitar
                        </button>
                      )}

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODALES DE ADMINISTRADOR (Crear y Asignar)... */}
      {isAdmin && isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-xl border border-gray-700 w-96 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Registrar Nuevo Activo</h3>
            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nombre del Dispositivo</label>
                <input type="text" required className="w-full bg-darker border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-primary transition" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Número de Serie</label>
                <input type="text" required className="w-full bg-darker border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-primary transition" value={formData.serialNumber} onChange={(e) => setFormData({...formData, serialNumber: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition font-medium">Cancelar</button>
                <button type="submit" className="bg-accent text-white font-bold py-2 px-6 rounded shadow-lg">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAdmin && isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-xl border border-gray-700 w-96 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Asignar Equipo</h3>
            <p className="text-primary font-medium mb-6">{selectedAsset?.name}</p>
            <form onSubmit={handleAssignSubmit} className="flex flex-col gap-5">
              <select required className="w-full bg-darker border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-primary" value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
                <option value="" disabled>-- Elige un empleado --</option>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsAssignModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition">Cancelar</button>
                <button type="submit" className="bg-primary text-darker font-bold py-2 px-6 rounded">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE EMPLEADO (Solicitar) */}
      {!isAdmin && isRequestModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-xl border border-gray-700 w-96 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Solicitar Equipo</h3>
            <p className="text-primary font-medium mb-4">{selectedAsset?.name}</p>
            <p className="text-sm text-gray-400 mb-6">Confirma tu perfil para enviar la petición al administrador. Recibirás respuesta pronto.</p>
            <form onSubmit={handleRequestSubmit} className="flex flex-col gap-5">
              <select required className="w-full bg-darker border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-primary" value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
                <option value="" disabled>-- Confirma tu usuario --</option>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsRequestModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition">Cancelar</button>
                <button type="submit" className="bg-primary text-darker font-bold py-2 px-6 rounded">Enviar Petición</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}