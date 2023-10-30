import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const apiPort = configService.get<number>('API_PORT');
  // TODO: move to custom config service
  const frontAppOrigins = configService
    .get<string>('ALLOWED_ORIGINS')
    .split(';');

  app.enableCors({ origin: frontAppOrigins });
  await app.setGlobalPrefix('api').listen(apiPort);
}
bootstrap();
