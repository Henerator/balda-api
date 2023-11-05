import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { SitemapStream, streamToPromise } from 'sitemap';

@Controller('sitemap')
export class SitemapController {
  constructor(private configService: ConfigService) {}

  @Get('xml')
  async sitemap(@Res() res: Response) {
    const domain = this.configService.get<string>('DOMAIN');

    res.set('Content-Type', 'text/xml');
    const smStream = new SitemapStream({ hostname: domain });
    smStream.write({
      url: '/',
      changefreq: 'weekly',
      priority: 1.0,
    });
    smStream.end();

    streamToPromise(smStream).then((xml) => {
      res.send(xml);
    });
  }
}
