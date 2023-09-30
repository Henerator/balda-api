import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfigFactory = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => {
  return {
    signOptions: { expiresIn: '1h' },
    secret: configService.get<string>('JWT_SECRET'),
  };
};
