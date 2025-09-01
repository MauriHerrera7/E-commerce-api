import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as tostream from 'buffer-to-stream';


@Injectable()
export class FileUploadRepository {
  async uploadImage(file: Express.Multer.File):Promise<UploadApiResponse> {
    return new Promise((resolve, rejects) => {
      const upload = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            rejects(error);
          } else {
            resolve(result!);
          }
        },
      );

      tostream(file.buffer).pipe(upload);
    });
  }
}
