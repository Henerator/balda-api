import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export const mongoConfigFactory = async (
  configService: ConfigService,
): Promise<MongooseModuleFactoryOptions> => {
  return {
    uri: configService.get<string>('MONGO_URI'),
    user: configService.get<string>('MONGO_USER'),
    pass: configService.get<string>('MONGO_PASSWORD'),
  };
};
