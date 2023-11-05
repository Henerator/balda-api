import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SitemapController } from './sitemap.controller';

@Module({
  imports: [ConfigModule],
  controllers: [SitemapController],
})
export class SitemapModule {}
