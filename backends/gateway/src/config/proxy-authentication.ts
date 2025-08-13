import { CasClientService } from '../modules/cas-client/cas-client.service';
import { getUserFromToken } from '../modules/utils/get-user-from-token';
import { IncomingMessage, ServerResponse } from 'http';
import { RequestHandler } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export function applyAuthenticatedProxy(
  app: any,
  paths: string[],
  target: string,
) {
  const authenticateRequest: RequestHandler<
    IncomingMessage,
    ServerResponse<IncomingMessage>
  > = Object.assign(
    async (req, res, next) => {
      try {
        const casClientService = new CasClientService();
        const userHeaders = await getUserFromToken(req, casClientService);
        if (userHeaders['x-user']) {
          req.headers['x-user'] = userHeaders['x-user'];
        }
        next();
      } catch (error) {
        console.error('Authentication error:', error.message);
        res.status(401).json({ message: 'Unauthorized' });
      }
    },
    {
      upgrade: (req: IncomingMessage, socket: any) => {
        console.warn('Upgrade requests are not handled for this route');
        socket.destroy();
      },
    },
  );

  paths.forEach((path) => {
    app.use(
      path,
      authenticateRequest,
      createProxyMiddleware({
        target,
        changeOrigin: true,
      }),
    );
  });
}
