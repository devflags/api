import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';


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
