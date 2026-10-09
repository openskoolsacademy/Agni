import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error('[Server Error]', {
    url: req.originalUrl,
    method: req.method,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || err.status || 500;

  // If this is a chat request, provide the user-friendly response requested in the specs
  if (req.originalUrl.includes('/api/chat')) {
    res.status(statusCode).json({
      error: "Sorry, I'm having trouble responding right now. Please try again in a moment.",
    });
    return;
  }

  res.status(statusCode).json({
    error: err.message || 'An unexpected internal server error occurred.',
  });
}
