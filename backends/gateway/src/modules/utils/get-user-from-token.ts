import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express'; // Import your JWT generation function
import { CasClientService } from '../cas-client/cas-client.service';
import { generateJwtToken } from './jwt.utils';

export const getUserFromToken = async (
  req: Request,
  casClientService: CasClientService,
) => {
  const accessToken = req.cookies?.access_token;

  if (!accessToken) {
    throw new UnauthorizedException('Access token not found');
  }

  try {
    const tokenValidationResponse = await casClientService.validateToken({
      req,
    });
    const { casId, isAdmin } = tokenValidationResponse.user;
    const jwtToken = generateJwtToken({ casId, isAdmin });

    return {
      'x-user': JSON.stringify(jwtToken),
    };
  } catch (error) {
    throw new UnauthorizedException(`Authentication error: ${error.message}`);
  }
};
