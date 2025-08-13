export interface JwtPayload {
  casId: string;
  isAdmin?: boolean;
  iat?: number;
  exp?: number;
}
