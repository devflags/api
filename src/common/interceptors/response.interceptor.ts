import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

export interface ApiResponse<T> {
    data: T;
    meta: {
        requestId: string;
        timestamp: string;
    };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();

        return next.handle().pipe(
            map(data => ({
                data,
                meta: {
                    requestId: request.requestId,
                    timestamp: request.requestStartedAt,
                },
            })),
        );
    }
}