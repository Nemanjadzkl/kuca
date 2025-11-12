"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/ui/spinner';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      // Provera se dešava samo na klijentu
      const user = localStorage.getItem('user');
      if (!user) {
        router.replace('/login');
      } else {
        setIsAuthenticated(true);
      }
    }, [router]);

    // Prikazujemo spinner dok se ne završi provera
    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
