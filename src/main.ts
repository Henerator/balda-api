import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { readFileSync } from 'fs';
import { AppModule } from './app.module';

const httpsOptions = {
  cert: readFileSync('/etc/ssl-sertificates/fullchain.pem'),
  key: readFileSync('/etc/ssl-sertificates/privkey.pem'),
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
  });

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
