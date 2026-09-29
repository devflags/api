import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth
  });

  app.useGlobalPipes(new ValidationPipe());


  app.enableShutdownHooks();


  await app.listen(process.env.API_PORT ?? 4000);
}
bootstrap();
