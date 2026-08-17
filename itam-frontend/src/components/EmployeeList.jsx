import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', department: '', email: '' });

  // 1. Recuperamos el Token (Pase VIP) de la memoria del navegador
  const token = localStorage.getItem('token');
  
  // 2. Preparamos la cabecera de autorización para las peticiones de modificación
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const fetchEmployees = () => {
    // 3. Adjuntamos la cabecera también al GET para que nos deje ver la lista
    fetch('http://localhost:8081/api/employees', { 
      headers: { 'Authorization': `Bearer ${token}` } 
    })
      .then(res => {
        if (!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      .then(data => setEmployees(data))
      .catch(() => toast.error("Error al cargar el directorio"));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    
    // 4. Enviamos el POST con las cabeceras de seguridad incluidas
    fetch('http://localhost:8081/api/employees', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(formData),
    })
    .then(async res => {
      // Si el backend nos rechaza (ej. error 403), lanzamos un error para que lo atrape el catch
      if (!res.ok) throw new Error("Petición rechazada por el servidor");
      return res.json();
    })
    .then(() => {
      setIsCreateModalOpen(false);
      setFormData({ name: '', department: '', email: '' });
      fetchEmployees();
      // Notificamos el doble éxito (empleado guardado y usuario generado)
      toast.success('Empleado y cuenta de acceso generados correctamente ✅');
    })
    .catch(() => toast.error("Error de seguridad: No se pudo guardar el empleado"));
  };

  return (
    <div className="bg-card p-8 rounded-xl shadow-lg border border-gray-800 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Directorio de Empleados</h2>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary text-darker font-bold py-2 px-4 rounded hover:opacity-80 transition"
        >
          + Nuevo Empleado
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-sm uppercase tracking-wider">
              <th className="pb-3 px-4 text-center w-16">ID</th>
              <th className="pb-3 px-4">Nombre</th>
              <th className="pb-3 px-4">Departamento</th>
              <th className="pb-3 px-4">Email / Usuario</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {employees.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-8 text-gray-500">Directorio vacío...</td></tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="py-4 px-4 text-center">#{emp.id}</td>
                  <td className="py-4 px-4 font-medium text-white">{emp.name}</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-700 text-gray-300">
                      {emp.department}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-sm text-primary">{emp.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL PARA CREAR EMPLEADO */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-xl border border-gray-700 w-96 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Registrar Nuevo Empleado</h3>
            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nombre Completo</label>
                <input type="text" required className="w-full bg-darker border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-primary transition" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Departamento</label>
                <input type="text" required className="w-full bg-darker border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-primary transition" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Correo Electrónico</label>
                <input type="email" required className="w-full bg-darker border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-primary transition" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition font-medium">Cancelar</button>
                <button type="submit" className="bg-accent text-white font-bold py-2 px-6 rounded shadow-lg">Guardar Empleado</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}