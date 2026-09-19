import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { Role } from 'src/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('file')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}
  @ApiBearerAuth()
  @Post('uploadImage/:productId')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Subir una imagen para un producto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 1024 * 1024, files: 1 },
      fileFilter: (_request, file, callback) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        callback(
          allowed.includes(file.mimetype)
            ? null
            : new UnsupportedMediaTypeException(
                'Only JPG, PNG, and WEBP images are accepted',
              ),
          allowed.includes(file.mimetype),
        );
      },
    }),
  )
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024,
            message: 'File is too large',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.fileUploadService.uploadImage(file, productId);
  }
}
