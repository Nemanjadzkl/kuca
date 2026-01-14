"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      const isAuthenticated = localStorage.getItem('user') === 'authenticated';
      if (!isAuthenticated) {
        router.push('/login');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
