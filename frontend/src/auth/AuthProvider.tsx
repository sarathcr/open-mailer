import { ReactKeycloakProvider } from '@react-keycloak/web';
import React from 'react';
import keycloak from './keycloak';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{ onLoad: 'login-required', checkLoginIframe: false }}
    >
      {children}
    </ReactKeycloakProvider>
  );
};
