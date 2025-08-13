// lib/apollo/authLink.ts
import keycloak from '@/auth/keycloak';
import { setContext } from '@apollo/client/link/context';

export const setAuthLink = setContext(async (_, { headers }) => {
  if (!keycloak.authenticated) {
    try {
      await keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      });
    } catch (e) {
      console.error('Failed to initialize Keycloak', e);
    }
  }

  const token = keycloak.token;

  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      apiKey: process.env.NEXT_PUBLIC_API_KEY,
    },
  };
});
