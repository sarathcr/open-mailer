import Keycloak from 'keycloak-js';

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = new Keycloak({
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? '',
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? '',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? '',
});

export default keycloak;
