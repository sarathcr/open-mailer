export function configureCors(app: any) {
  const allowedOrigins = process.env.FRONTEND_URLS?.split(',') || [];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new Error(
            `Not allowed by Gate CORS, origin: ${origin}. urls: ${process.env.FRONTEND_URLS}`,
          ),
        );
      }
    },
    credentials: true,
  });
}
