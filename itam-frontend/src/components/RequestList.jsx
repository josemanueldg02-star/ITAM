import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function RequestList() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('role') === 'ROLE_ADMIN';

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const fetchRequests = () => {
    // Si es admin, pedimos todas las peticiones al backend
    if (isAdmin) {
      fetch('http://localhost:8081/api/requests', { headers: authHeaders })
        .then(res => res.json())
        .then(data => setRequests(data))
        .catch(() => toast.error("Error al cargar las peticiones"));
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = (requestId, newStatus) => {
    fetch(`http://localhost:8081/api/requests/${requestId}/status?status=${newStatus}`, {
      method: 'PUT',
      headers: authHeaders
    })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(() => {
      fetchRequests();
      toast.success(newStatus === 'APROBADA' ? 'Petición Aprobada ✅' : 'Petición Rechazada ❌');
    })
    .catch(() => toast.error("Error al actualizar la petición"));
  };

  return (
    <div className="bg-card p-8 rounded-xl shadow-lg border border-gray-800 relative">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Centro de Peticiones</h2>
        <p className="text-sm text-gray-400 mt-1">Gestiona las solicitudes de hardware de los empleados.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-sm uppercase tracking-wider">
              <th className="pb-3 px-4 text-center w-16">ID</th>
              <th className="pb-3 px-4">Empleado</th>
              <th className="pb-3 px-4">Equipo Solicitado</th>
              <th className="pb-3 px-4 text-center">Fecha</th>
              <th className="pb-3 px-4 text-center">Estado</th>
              {isAdmin && <th className="pb-3 px-4 text-center">Acciones</th>}
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {requests.length === 0 ? (
              <tr><td colSpan={isAdmin ? 6 : 5} className="text-center py-8 text-gray-500">No hay peticiones registradas...</td></tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="py-4 px-4 text-center">#{req.id}</td>
                  <td className="py-4 px-4 font-medium text-white">{req.employee.name}</td>
                  <td className="py-4 px-4 text-primary">{req.asset.name}</td>
                  <td className="py-4 px-4 text-center text-sm text-gray-400">
                    {new Date(req.requestDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      req.status === 'PENDIENTE' ? 'bg-orange-500/20 text-orange-400' : 
                      req.status === 'APROBADA' ? 'bg-accent/20 text-accent' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  
                  {/* Botones de acción solo para el Admin y solo si está PENDIENTE */}
                  {isAdmin && (
                    <td className="py-4 px-4">
                      <div className="flex justify-center items-center gap-2">
                        {req.status === 'PENDIENTE' ? (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(req.id, 'APROBADA')}
                              className="bg-gray-700 hover:bg-accent hover:text-white text-white text-xs font-bold py-1 px-3 rounded transition"
                            >
                              Aprobar
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(req.id, 'RECHAZADA')}
                              className="bg-gray-700 hover:bg-red-500 hover:text-white text-white text-xs font-bold py-1 px-3 rounded transition"
                            >
                              Rechazar
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-500">-</span>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}