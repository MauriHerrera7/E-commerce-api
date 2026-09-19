import { Inject, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as tostream from 'buffer-to-stream';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploadRepository {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinaryClient: typeof cloudinary,
    private readonly configService: ConfigService,
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, rejects) => {
      const upload = this.cloudinaryClient.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: this.configService.get<string>(
            'CLOUDINARY_FOLDER',
            'ecommerce/products',
          ),
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        },
        (error, result) => {
          if (error) {
            rejects(new Error('Cloudinary upload failed'));
          } else {
            resolve(result!);
          }
        },
      );

      tostream(file.buffer).pipe(upload);
    });
  }
}
