import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
import { applyAuthenticatedProxy } from './proxy-authentication';

export function setUpProxies(app: any) {
  app.use('/mailer-public', createProxy(process.env.MAILER_STATIC_URL));

  applyAuthenticatedProxy(app, ['/uploads'], process.env.UPLOADS_BACKEND_URL);
  applyAuthenticatedProxy(
    app,
    ['/files/private'],
    `${process.env.UPLOADS_FILES_URL}/private`,
  );

  app.use('/files', createProxy(process.env.UPLOADS_FILES_URL));
}

export function createProxy(target: string): RequestHandler {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
  });
}
