"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (username === 'Rados' && password === 'Kodar123') {
      localStorage.setItem('user', 'authenticated');
      router.push('/');
    } else {
      setError('Pogrešno korisničko ime ili lozinka.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Prijava</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Korisničko ime</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Lozinka</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Prijavi se
        </button>
      </div>
    </div>
  );
}
