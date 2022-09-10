import requestIp from 'request-ip'
import rateLimit from 'express-rate-limit'
import { Request, Response, NextFunction } from 'express';

const limiter = (time: number, max: number, handler?: (req: Request, res: Response, next?: NextFunction) => unknown) => {
  return rateLimit({
    windowMs: time,
    max: max,
    handler: handler || function (req: Request, res: Response): unknown {
      return res.status(429).json({
        success: false,
        message: 'Too many attempts.  Please try again later.'
      })
    },
    keyGenerator: function (req: Request, res: Response): string {
      return requestIp.getClientIp(req);
    }
  })
};

export default limiter;