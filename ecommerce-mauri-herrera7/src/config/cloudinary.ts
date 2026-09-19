import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryConfig = {
  provide: 'CLOUDINARY',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const cloudName = configService.get<string>('CLOUD_NAME');
    const apiKey = configService.get<string>('API_KEY');
    const apiSecret = configService.get<string>('API_SECRET');
    if (!cloudName || !apiKey || !apiSecret) {
      return undefined;
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    return cloudinary;
  },
};
