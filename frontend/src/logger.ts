/**
 * Frontend logger for OctoCAT Supply.
 * Provides structured, color-coded console logging to trace which
 * components render, which API calls fire, and which user actions occur.
 *
 * All logs are prefixed with [OCTOCAT] for easy filtering in DevTools.
 */

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const LEVEL_STYLES: Record<LogLevel, string> = {
  DEBUG: 'color: #8B8B8B; font-weight: normal',
  INFO: 'color: #76B852; font-weight: bold',
  WARN: 'color: #FFA500; font-weight: bold',
  ERROR: 'color: #FF4444; font-weight: bold',
};

function log(level: LogLevel, tag: string, message: string, data?: unknown): void {
  const timestamp = new Date().toISOString().split('T')[1].replace('Z', '');
  const prefix = `[OCTOCAT] [${level}] ${timestamp} [${tag}]`;

  if (data !== undefined) {
    console.log(`%c${prefix}%c ${message}`, LEVEL_STYLES[level], '', data);
  } else {
    console.log(`%c${prefix}%c ${message}`, LEVEL_STYLES[level], '');
  }
}

export const frontendLogger = {
  debug: (tag: string, message: string, data?: unknown) => log('DEBUG', tag, message, data),
  info: (tag: string, message: string, data?: unknown) => log('INFO', tag, message, data),
  warn: (tag: string, message: string, data?: unknown) => log('WARN', tag, message, data),
  error: (tag: string, message: string, data?: unknown) => log('ERROR', tag, message, data),

  /** Log an outgoing API request */
  apiRequest: (method: string, url: string, data?: unknown) => {
    log('INFO', 'API', `→ ${method} ${url}`, data);
  },

  /** Log an API response */
  apiResponse: (method: string, url: string, status: number, data?: unknown) => {
    const level: LogLevel = status >= 400 ? 'ERROR' : 'INFO';
    log(level, 'API', `← ${method} ${url} [${status}]`, data);
  },

  /** Log a component mount */
  componentMount: (componentName: string) => {
    log('DEBUG', 'COMPONENT', `${componentName} mounted`);
  },

  /** Log a component unmount */
  componentUnmount: (componentName: string) => {
    log('DEBUG', 'COMPONENT', `${componentName} unmounted`);
  },

  /** Log a route navigation */
  navigation: (path: string) => {
    log('INFO', 'ROUTER', `Navigated to: ${path}`);
  },

  /** Log a user action (click, form submit, etc.) */
  userAction: (action: string, detail?: unknown) => {
    log('INFO', 'USER', action, detail);
  },

  /** Log context/state changes */
  stateChange: (context: string, change: string, detail?: unknown) => {
    log('DEBUG', `STATE:${context}`, change, detail);
  },
};
