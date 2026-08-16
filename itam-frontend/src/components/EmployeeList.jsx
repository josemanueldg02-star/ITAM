import { useState, useEffect } from 'react';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    email: ''
  });

  const fetchEmployees = () => {
    fetch('http://localhost:8081/api/employees')
      .then(response => response.json())
      .then(data => setEmployees(data))
      .catch(error => console.error("Error conectando con el backend:", error));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:8081/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(() => {
      setIsModalOpen(false);
      setFormData({ name: '', department: '', email: '' });
      fetchEmployees();
    })
    .catch(error => console.error("Error al guardar:", error));
  };

  return (
    <div className="bg-card p-8 rounded-xl shadow-lg border border-gray-800 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Directorio de Empleados</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-darker font-bold py-2 px-4 rounded hover:opacity-80 transition"
        >
          + Nuevo Empleado
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-sm uppercase tracking-wider">
              <th className="pb-3 px-4">ID</th>
              <th className="pb-3 px-4">Nombre</th>
              <th className="pb-3 px-4">Departamento</th>
              <th className="pb-3 px-4">Email</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {employees.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  Cargando empleados o directorio vacío...
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="py-4 px-4">#{employee.id}</td>
                  <td className="py-4 px-4 font-medium text-white">{employee.name}</td>
                  <td className="py-4 px-4 text-primary">{employee.department}</td>
                  <td className="py-4 px-4 text-gray-400">{employee.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL PARA NUEVO EMPLEADO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-xl border border-gray-700 w-96 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Registrar Nuevo Empleado</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Carlos Sánchez"
                  className="w-full bg-darker border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-primary transition"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Departamento</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Recursos Humanos"
                  className="w-full bg-darker border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-primary transition"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Correo Electrónico</label>
                <input 
                  type="email" 
                  required
                  placeholder="ejemplo@empresa.com"
                  className="w-full bg-darker border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-primary transition"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-accent text-white font-bold py-2 px-6 rounded hover:opacity-80 transition shadow-lg"
                >
                  Guardar Empleado
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}