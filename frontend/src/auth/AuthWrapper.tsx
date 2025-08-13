import { useKeycloak } from '@react-keycloak/web';
import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    console.log(keycloak?.authenticated, 'Keycloak authenticated status');

    if (!keycloak?.authenticated && initialized) {
      keycloak?.login();
    }
  }, [keycloak]);

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-700" />
      </div>
    );
  }

  if (!keycloak?.authenticated) return null;

  return <>{children}</>;
};
