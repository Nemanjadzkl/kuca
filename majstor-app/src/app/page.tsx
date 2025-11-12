"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8 pb-4 border-b">
        <h1 className="text-3xl font-bold">MajstorApp</h1>
        <nav>
          {user ? (
            <Link href="/dashboard"><Button variant="link">Dashboard</Button></Link>
          ) : (
            <Link href="/login"><Button variant="link">Prijavi se</Button></Link>
          )}
        </nav>
      </header>
      <main className="text-center mt-20">
        <h2 className="text-4xl font-bold mb-4">Dobrodošli u MajstorApp</h2>
        <p className="text-lg text-gray-600">Vaše rešenje za upravljanje poslovima.</p>
      </main>
    </div>
  );
}
