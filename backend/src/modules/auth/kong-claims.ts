// src/auth/kong-claims.ts
export type KeycloakAccessToken = {
  sub?: string;
  preferred_username?: string;
  email?: string;
  name?: string;
  resource_access?: Record<string, { roles?: string[] }>;
  realm_access?: { roles?: string[] };
  roles?: string[]; // some setups map roles here
  [k: string]: any;
};

export function parseBase64UrlJson<T = any>(
  value?: string | string[],
): T | undefined {
  if (!value) return undefined;
  const raw = Array.isArray(value) ? value[0] : value;
  try {
    // base64url => base64
    const b64 = raw.replace(/-/g, '+').replace(/_/g, '/');
    const json = Buffer.from(b64, 'base64').toString('utf8');
    return JSON.parse(json) as T;
  } catch {
    return undefined;
  }
}

export function decodeJwtPayload<T = any>(jwt?: string): T | undefined {
  if (!jwt) return undefined;
  const parts = jwt.split('.');
  if (parts.length < 2) return undefined;
  try {
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = Buffer.from(b64, 'base64').toString('utf8');
    return JSON.parse(json) as T;
  } catch {
    return undefined;
  }
}
