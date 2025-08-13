import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Automatically reject expired tokens
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: any) {
    // You can add more validation logic here, such as checking token revocation
    if (!payload) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return payload; // Return the payload to be available in the request object
  }
}
