import rateLimit from 'express-rate-limit';

// Standard rate limiter for public chat endpoints (e.g. 60 messages per minute per IP)
export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please slow down and try again in a few moments.',
  },
});

// Stricter rate limiter for auth endpoints (e.g. 15 requests per 15 minutes)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts. Please try again later.',
  },
});
