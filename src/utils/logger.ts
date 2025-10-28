/* Lightweight logger wrapper. Exposes methods that can be extended to forward logs to a
   remote service (Sentry, LogRocket) by changing implementations here. */
export const isDev = typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production';

export function info(...args: any[]) {
  if (isDev) console.info('[app]', ...args);
}

export function debug(...args: any[]) {
  if (isDev) console.debug('[app]', ...args);
}

export function warn(...args: any[]) {
  console.warn('[app]', ...args);
}

export function error(...args: any[]) {
  console.error('[app]', ...args);
}

export default {
  info,
  debug,
  warn,
  error,
};
