// Basic logger with environment-based log levels
// Suppresses debug and info in production

type Level = 'debug' | 'info' | 'warn' | 'error';

const levels: Record<Level, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const env =
  (typeof process !== 'undefined' && process.env && process.env.NODE_ENV) ||
  'development';
const currentLevel = env === 'production' ? levels.warn : levels.debug;

function log(level: Level, ...args: unknown[]): void {
  if (levels[level] < currentLevel) return;
  const method = level === 'debug' ? 'log' : level;
  if (typeof console !== 'undefined' && (console as any)[method]) {
    (console as any)[method](...args);
  }
}

const logger = {
  debug: (...args: unknown[]) => log('debug', ...args),
  info: (...args: unknown[]) => log('info', ...args),
  warn: (...args: unknown[]) => log('warn', ...args),
  error: (...args: unknown[]) => log('error', ...args),
};

export default logger;

// Attach to global scope for non-module scripts
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    logger: typeof logger;
  }
}

if (typeof window !== 'undefined') {
  window.logger = logger;
} else if (typeof global !== 'undefined') {
  (global as any).logger = logger;
}

export { logger };
