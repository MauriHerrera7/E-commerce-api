import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryConfig = {
  provide: 'CLOUDINARY',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    cloudinary.config({
      cloud_name: configService.getOrThrow<string>('CLOUD_NAME'),
      api_key: configService.getOrThrow<string>('API_KEY'),
      api_secret: configService.getOrThrow<string>('API_SECRET'),
    });
    return cloudinary;
  },
};
