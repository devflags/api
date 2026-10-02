import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../constants/error-codes';

export interface ValidationDetail {
    field?: string;
    code?: string;
    message: string;
}

export class AppException extends HttpException {
    public readonly code: ErrorCode;
    public readonly details?: ValidationDetail[];

    constructor(params: {
        code: ErrorCode;
        message: string;
        status: HttpStatus;
        details?: ValidationDetail[];
    }) {
        super(params.message, params.status);
        this.code = params.code;
        this.details = params.details;
    }

    static notFound(code: ErrorCode, message: string, details?: ValidationDetail[]) {
        return new AppException({ code, message, status: HttpStatus.NOT_FOUND, details });
    }

    static badRequest(code: ErrorCode, message: string, details?: ValidationDetail[]) {
        return new AppException({ code, message, status: HttpStatus.BAD_REQUEST, details });
    }

    static conflict(code: ErrorCode, message: string, details?: ValidationDetail[]) {
        return new AppException({ code, message, status: HttpStatus.CONFLICT, details });
    }

    static forbidden(code: ErrorCode, message: string, details?: ValidationDetail[]) {
        return new AppException({ code, message, status: HttpStatus.FORBIDDEN, details });
    }

    static unauthorized(code: ErrorCode, message: string, details?: ValidationDetail[]) {
        return new AppException({ code, message, status: HttpStatus.UNAUTHORIZED, details });
    }

    static internal(code: ErrorCode, message: string, details?: ValidationDetail[]) {
        return new AppException({ code, message, status: HttpStatus.INTERNAL_SERVER_ERROR, details });
    }

    static validation(details: ValidationDetail[]) {
        return new AppException({
            code: ErrorCode.VALIDATION_ERROR,
            message: 'Validation failed.',
            status: HttpStatus.BAD_REQUEST,
            details
        });
    }
}