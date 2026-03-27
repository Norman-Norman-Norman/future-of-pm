import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger';

/**
 * Express middleware that logs every incoming request and outgoing response.
 * Captures: method, path, query params, body (for mutations), status code, and duration.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const { method, path, query } = req;

  const requestInfo: Record<string, unknown> = {};
  if (Object.keys(query).length > 0) {
    requestInfo.query = query;
  }
  if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
    requestInfo.body = req.body;
  }
  requestInfo.ip = req.ip || req.socket.remoteAddress;
  requestInfo.userAgent = req.get('user-agent');

  logger.request(method, path, Object.keys(requestInfo).length > 0 ? requestInfo : undefined);

  // Capture original end to intercept response
  const originalEnd = res.end;
  res.end = function (this: Response, ...args: Parameters<Response['end']>) {
    const duration = Date.now() - start;
    logger.response(method, path, res.statusCode, duration);
    return originalEnd.apply(this, args);
  } as Response['end'];

  next();
}
