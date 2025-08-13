import { UnauthorizedException } from '@nestjs/common';

function normalize(u?: string) {
  return (u ?? '').trim().replace(/\/+$/, '');
}

export function assertIssuerAndAudience(user: any) {
  const tokenIss = normalize(user?.iss);
  const expectedIss = normalize(process.env.KEYCLOAK_ISSUER);

  if (!tokenIss || !expectedIss || tokenIss !== expectedIss) {
    throw new UnauthorizedException('Invalid token issuer');
  }

  // Audience / authorized-party checks (optional but recommended)
  const expectedAud =
    process.env.KEYCLOAK_AUDIENCE ?? process.env.KEYCLOAK_CLIENT_ID;
  const aud = user?.aud; // can be string or string[]
  const azp = user?.azp;

  const audOk = Array.isArray(aud)
    ? aud?.includes(expectedAud)
    : aud === expectedAud;
  const azpOk = expectedAud ? azp === expectedAud : true;

  if (expectedAud && !(audOk || azpOk)) {
    throw new UnauthorizedException('Invalid token audience');
  }
}
