import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // TODO: add environment path for client
  app.enableCors({
    origin: 'http://localhost:4200',
  });
  await app.setGlobalPrefix('api').listen(3000);
}
bootstrap();
