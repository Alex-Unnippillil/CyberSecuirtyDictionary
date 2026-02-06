// Basic logger with environment-based log levels
// Suppresses debug and info in production

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const env =
  (typeof process !== 'undefined' && process.env && process.env.NODE_ENV) ||
  'development';
const currentLevel = env === 'production' ? levels.warn : levels.debug;

function log(level, ...args) {
  if (levels[level] < currentLevel) return;
  const method = level === 'debug' ? 'log' : level;
  if (typeof console !== 'undefined' && console[method]) {
    console[method](...args);
  }
}

const logger = {
  debug: (...args) => log('debug', ...args),
  info: (...args) => log('info', ...args),
  warn: (...args) => log('warn', ...args),
  error: (...args) => log('error', ...args),
};

if (typeof window !== 'undefined') {
  window.logger = logger;
} else if (typeof global !== 'undefined') {
  global.logger = logger;
}

module.exports = logger;
