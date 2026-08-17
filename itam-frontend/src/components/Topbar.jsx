import { useState } from 'react';

export default function Topbar({ onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Rescatamos los datos del usuario actual
  const username = localStorage.getItem('username') || 'Usuario';
  const role = localStorage.getItem('role') === 'ROLE_ADMIN' ? 'Administrador' : 'Empleado';

  // Sacamos la primera letra del email/usuario para el avatar
  const initial = username.charAt(0).toUpperCase();

  return (
    <div className="flex justify-end items-center px-10 py-4 bg-darker border-b border-gray-800">
      
      {/* Contenedor relativo para que el menú desplegable flote justo debajo */}
      <div className="relative">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 focus:outline-none hover:opacity-80 transition"
        >
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-white">{username}</p>
            <p className="text-xs text-primary">{role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-darker font-bold text-lg shadow-lg">
            {initial}
          </div>
        </button>

        {/* Menú Desplegable */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-48 bg-card border border-gray-700 rounded-xl shadow-2xl py-2 z-50">
            <div className="px-4 py-3 border-b border-gray-700 mb-2 md:hidden">
              <p className="text-sm font-bold text-white truncate">{username}</p>
              <p className="text-xs text-primary truncate">{role}</p>
            </div>
            
            <button 
              onClick={onLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}