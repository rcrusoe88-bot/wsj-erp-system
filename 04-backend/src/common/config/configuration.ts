export default () => ({
  app: {
    port: Number(process.env.PORT ?? 3000),
  },
  database: {
    url: process.env.DATABASE_URL ?? '',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'materia-erp-dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '24h',
  },
});
