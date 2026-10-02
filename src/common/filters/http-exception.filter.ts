import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppException, ValidationDetail } from '../exceptions/app.exception';
import { ErrorCode } from '../constants/error-codes';
import { Prisma } from '../../database/generated/prisma/client';

const STATUS_TO_ERROR: Record<number, ErrorCode> = {
    400: ErrorCode.BAD_REQUEST,
    401: ErrorCode.UNAUTHORIZED,
    403: ErrorCode.FORBIDDEN,
    404: ErrorCode.NOT_FOUND,
    409: ErrorCode.CONFLICT,
    422: ErrorCode.VALIDATION_ERROR,
    429: ErrorCode.BAD_REQUEST,
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let code = ErrorCode.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let details: ValidationDetail[] | undefined = undefined;

        if (exception instanceof AppException) {
            status = exception.getStatus();
            code = exception.code;
            message = exception.message;
            details = exception.details;
        } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            if (exception.code === 'P2002') {
                status = HttpStatus.CONFLICT;
                code = ErrorCode.UNIQUE_CONSTRAINT;
                message = 'Unique constraint failed';
                const target = exception.meta?.target as string[];
                if (target && target.length > 0) {
                    details = target.map(field => ({ field, message: 'Already exists.' }));
                }
            } else if (exception.code === 'P2025') {
                status = HttpStatus.NOT_FOUND;
                code = ErrorCode.NOT_FOUND;
                message = 'Record not found';
            } else {
                // Other known Prisma errors
                message = exception.message;
            }
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            const responseBody: any = exception.getResponse();

            if (typeof responseBody === 'object' && responseBody !== null) {
                message = responseBody.message || exception.message;
                code = STATUS_TO_ERROR[status] || ErrorCode.INTERNAL_SERVER_ERROR;
            } else {
                message = exception.message;
                code = STATUS_TO_ERROR[status] || ErrorCode.INTERNAL_SERVER_ERROR;
            }
        } else if (exception instanceof Error) {
            // For 500s we DO NOT leak the message to the client.
            // E.g. "Connection string postgres://root:password@..."
            message = 'Internal server error';
        }

        if (status >= 500) {
            this.logger.error(`[${request.requestId}] ${request.ip || 'unknown-ip'} ${request.method} ${request.originalUrl} - ${exception instanceof Error ? exception.message : 'Unknown error'}`, exception instanceof Error ? exception.stack : '');
        }

        response
            .status(status)
            .json({
                error: {
                    statusCode: status,
                    code,
                    message,
                    ...(details ? { details } : {})
                },
                meta: {
                    requestId: request.requestId,
                    timestamp: request.requestStartedAt,
                    path: request.originalUrl,
                }
            });
    }
}