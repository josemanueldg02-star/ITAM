import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pedimos los datos al backend al cargar el componente
  useEffect(() => {
    // 1. Recuperamos el pase VIP del bolsillo del navegador
    const token = localStorage.getItem('token');

    // 2. Hacemos la petición adjuntando las Cabeceras (Headers)
    fetch('http://localhost:8081/api/assets', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error("Acceso denegado");
        return response.json();
      })
      .then(data => {
        setAssets(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error conectando con el backend:", error);
        setIsLoading(false);
      });
  }, []);

  // Matemáticas de nuestro negocio (Estadísticas dinámicas)
  const totalActivos = assets.length;
  const disponibles = assets.filter(asset => asset.status === 'DISPONIBLE').length;
  const asignados = assets.filter(asset => asset.status === 'ASIGNADO').length;
  const enReparacion = assets.filter(asset => asset.status === 'EN REPARACIÓN').length;

  return (
    <div className="bg-card p-10 rounded-xl shadow-lg border border-gray-800 text-center max-w-4xl mx-auto mt-10">
      <h1 className="text-4xl font-bold text-primary mb-4 tracking-wider">
        ITAM Dashboard
      </h1>
      <p className="text-lg text-gray-400 mb-8">
        Resumen de inventario.
      </p>

      {isLoading ? (
        <p className="text-gray-500 animate-pulse">Calculando métricas en tiempo real...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          
          <div className="bg-darker p-6 rounded-lg border border-gray-700 shadow-sm hover:border-gray-500 transition">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Activos</h3>
            <p className="text-4xl font-bold text-white mt-3">{totalActivos}</p>
          </div>
          
          <div className="bg-darker p-6 rounded-lg border border-gray-700 shadow-sm hover:border-blue-500/50 transition">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Disponibles</h3>
            <p className="text-4xl font-bold text-blue-400 mt-3">{disponibles}</p>
          </div>
          
          <div className="bg-darker p-6 rounded-lg border border-gray-700 shadow-sm hover:border-accent/50 transition">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Asignados</h3>
            <p className="text-4xl font-bold text-accent mt-3">{asignados}</p>
          </div>
          
          <div className="bg-darker p-6 rounded-lg border border-gray-700 shadow-sm hover:border-red-500/50 transition">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">En Reparación</h3>
            <p className="text-4xl font-bold text-red-400 mt-3">{enReparacion}</p>
          </div>

        </div>
      )}
    </div>
  );
}