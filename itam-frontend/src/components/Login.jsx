import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Hacemos la petición a nuestra nueva "Puerta de Entrada"
    fetch('http://localhost:8081/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(async (res) => {
      if (!res.ok) throw new Error('Credenciales incorrectas');
      return res.json();
    })
    .then((data) => {
      // Magia: Guardamos el "Pase VIP" y los datos en la memoria del navegador
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);

      toast.success(`¡Bienvenido, ${data.username}!`);
      onLoginSuccess(); // Avisamos a App.jsx de que podemos pasar
    })
    .catch(() => toast.error('Usuario o contraseña incorrectos'));
  };

  return (
    <div className="flex h-screen items-center justify-center bg-darker">
      <div className="bg-card p-10 rounded-xl shadow-2xl border border-gray-800 w-96">
        
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-primary tracking-wider mb-2">ITAM</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Control de Acceso</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Usuario</label>
            <input
              type="text"
              required
              className="w-full bg-darker border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-primary transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Contraseña</label>
            <input
              type="password"
              required
              className="w-full bg-darker border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-primary transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-darker font-bold py-3 px-4 rounded mt-4 hover:opacity-90 transition shadow-lg"
          >
            Iniciar Sesión
          </button>
        </form>
        
      </div>
    </div>
  );
}