import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import cookieParser from 'cookie-parser';
import { ValidationError } from '@nestjs/common';
import { AppException, ValidationDetail } from './common/exceptions/app.exception';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

function formatValidationErrors(errors: ValidationError[], parentProperty: string = ''): ValidationDetail[] {
  const formattedErrors: ValidationDetail[] = [];

  for (const error of errors) {
    const propertyPath = parentProperty ? `${parentProperty}.${error.property}` : error.property;

    if (error.constraints) {
      const firstConstraintKey = Object.keys(error.constraints)[0];
      const code = firstConstraintKey
        ? firstConstraintKey.replace(/([A-Z])/g, '_$1').toUpperCase()
        : 'INVALID';

      formattedErrors.push({
        field: propertyPath,
        code,
        message: error.constraints[firstConstraintKey] || 'Validation error',
      });
    }

    if (error.children && error.children.length > 0) {
      formattedErrors.push(...formatValidationErrors(error.children, propertyPath));
    }
  }

  return formattedErrors;
}

function normalizeForwardedProto(value: string | string[] | undefined): string | undefined {
  const firstValue = Array.isArray(value) ? value[0] : value;
  return firstValue?.split(",", 1)[0].trim() || undefined;
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth
  });

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });



  // Pipes Globais (Validação com DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const details = formatValidationErrors(errors);
        return AppException.validation(details);
      }
    }),
  );

  // Global Interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(cookieParser());

  app.enableShutdownHooks();


  app.getHttpAdapter().getInstance().set("trust proxy", 1);

  app.use((request, _response, next) => {
    const forwardedProto = normalizeForwardedProto(
      request.headers["x-forwarded-proto"],
    );

    if (forwardedProto) {
      request.headers["x-forwarded-proto"] = forwardedProto;
    }

    next();
  });


  await app.listen(process.env.API_PORT ?? 4000);
}
bootstrap();
