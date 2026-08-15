import { useState, useEffect } from 'react';

export default function AssetList() {
  // 1. Estado para la lista de activos
  const [assets, setAssets] = useState([]);
  
  // 2. Nuevos estados para controlar nuestra ventana emergente
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    status: 'DISPONIBLE' // Por defecto, un activo nuevo está disponible
  });

  // Extraemos la llamada al backend a una función para poder reutilizarla
  const fetchAssets = () => {
    fetch('http://localhost:8081/api/assets')
      .then(response => response.json())
      .then(data => setAssets(data))
      .catch(error => console.error("Error conectando con el backend:", error));
  };

  // Se ejecuta al cargar la página
  useEffect(() => {
    fetchAssets();
  }, []);

  // 3. Función que se dispara al pulsar "Guardar" en el formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página web parpadee o se recargue

    // Hacemos la petición POST a Spring Boot
    fetch('http://localhost:8081/api/assets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData), // Convertimos nuestros datos a formato JSON
    })
    .then(response => response.json())
    .then(() => {
      setIsModalOpen(false); // Cerramos el modal
      setFormData({ name: '', serialNumber: '', status: 'DISPONIBLE' }); // Limpiamos el formulario
      fetchAssets(); // Volvemos a pedir la lista para que aparezca el nuevo portátil/móvil
    })
    .catch(error => console.error("Error al guardar:", error));
  };

  return (
    // Añadimos 'relative' para poder centrar la ventana emergente sobre esta vista
    <div className="bg-card p-8 rounded-xl shadow-lg border border-gray-800 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Inventario de Activos</h2>
        {/* Al hacer clic, cambiamos el estado para abrir el modal */}
        <button 
          onClick={() => setIsModalOpen(true)}
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
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {assets.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 4. EL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-xl border border-gray-700 w-96 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Registrar Nuevo Activo</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nombre del Dispositivo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Poco X8 Pro o iPad"
                  className="w-full bg-darker border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-primary transition"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Número de Serie</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: SN-2026-XYZ"
                  className="w-full bg-darker border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-primary transition"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Estado Inicial</label>
                <select 
                  className="w-full bg-darker border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-primary transition"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="DISPONIBLE">DISPONIBLE</option>
                  <option value="EN REPARACIÓN">EN REPARACIÓN</option>
                </select>
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
                  Guardar Activo
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}