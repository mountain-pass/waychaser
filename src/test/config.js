import assert from 'assert';

export const BROWSER_PORT = Number.parseInt(process.env.BROWSER_PORT);

assert(process.env.API_PORT, `'API_PORT' environment variable must be set`);
export const API_PORT = Number.parseInt(process.env.API_PORT);

// nodejs tests access the API directly via the API_PORT
// browser tests access the API via the BROWSER_PORT, which proxies the API_PORT
// doing it this way means we don't have to dick around with cors
export const API_ACCESS_PORT =
  process.env.npm_lifecycle_event === 'test:node-api' ? API_PORT : BROWSER_PORT;
assert(
  !process.env.npm_lifecycle_event.startsWith('test:browser-api') ||
    process.env.BROWSER_PORT,
  `'BROWSER_PORT' environment variable must be set when testing browser api`
);

export const BROWSER_HOST = process.env.npm_lifecycle_event.includes('iphone')
  ? /* istanbul ignore next: only get's executed on CI server */
    'bs-local.com'
  : 'localhost';

export const API_ACCESS_HOST = BROWSER_HOST;
