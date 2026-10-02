import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Only accept x-request-id if we trust the origin. For now, generate a secure UUID.
        const requestId = crypto.randomUUID();

        req.requestId = requestId;
        req.requestStartedAt = new Date().toISOString();

        res.setHeader('x-request-id', requestId);
        next();
    }
}