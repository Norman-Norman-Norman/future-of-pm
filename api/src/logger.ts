/**
 * Centralized logger for OctoCAT Supply API.
 * Provides structured, timestamped logging with log levels and context tags.
 * Use this to trace exactly which code paths are hit at runtime.
 */

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const LOG_COLORS: Record<LogLevel, string> = {
  DEBUG: '\x1b[36m',  // cyan
  INFO: '\x1b[32m',   // green
  WARN: '\x1b[33m',   // yellow
  ERROR: '\x1b[31m',  // red
};
const RESET = '\x1b[0m';

function formatTimestamp(): string {
  return new Date().toISOString();
}

function log(level: LogLevel, tag: string, message: string, data?: unknown): void {
  const color = LOG_COLORS[level];
  const timestamp = formatTimestamp();
  const prefix = `${color}[${level}]${RESET} ${timestamp} [${tag}]`;

  if (data !== undefined) {
    console.log('%s %s', prefix, message, typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
  } else {
    console.log('%s %s', prefix, message);
  }
}

export const logger = {
  debug: (tag: string, message: string, data?: unknown) => log('DEBUG', tag, message, data),
  info: (tag: string, message: string, data?: unknown) => log('INFO', tag, message, data),
  warn: (tag: string, message: string, data?: unknown) => log('WARN', tag, message, data),
  error: (tag: string, message: string, data?: unknown) => log('ERROR', tag, message, data),

  /** Log an incoming HTTP request */
  request: (method: string, path: string, extra?: Record<string, unknown>) => {
    log('INFO', 'HTTP', `→ ${method} ${path}`, extra);
  },

  /** Log an outgoing HTTP response */
  response: (method: string, path: string, statusCode: number, durationMs: number, extra?: Record<string, unknown>) => {
    const level: LogLevel = statusCode >= 500 ? 'ERROR' : statusCode >= 400 ? 'WARN' : 'INFO';
    log(level, 'HTTP', `← ${method} ${path} ${statusCode} (${durationMs}ms)`, extra);
  },

  /** Log a route handler being entered */
  route: (routeName: string, action: string, detail?: unknown) => {
    log('DEBUG', `ROUTE:${routeName}`, action, detail);
  },

  /** Log seed data loading */
  seed: (entity: string, count: number) => {
    log('INFO', 'SEED', `Loaded ${count} ${entity} records`);
  },

  /** Log application lifecycle events */
  lifecycle: (event: string, detail?: unknown) => {
    log('INFO', 'APP', event, detail);
  },
};
