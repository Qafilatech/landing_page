/**
 * SuperTokens app info — must match qafila-platform API_DOMAIN / WEBSITE_DOMAIN.
 * Override via Vite env when deploying.
 */
export const appInfo = {
  appName: 'QafilaTech',
  apiDomain:
    (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/+$/, '') ||
    'http://localhost:3001',
  websiteDomain:
    (import.meta.env.VITE_WEBSITE_DOMAIN as string | undefined)?.replace(/\/+$/, '') ||
    'http://localhost:3000',
  apiBasePath: '/api/auth',
  websiteBasePath: '/auth',
};
