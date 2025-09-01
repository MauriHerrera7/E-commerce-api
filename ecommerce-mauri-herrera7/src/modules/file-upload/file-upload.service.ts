import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './file-upload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/modules/products/entities/products.entity';
import {  Repository } from 'typeorm';

@Injectable()
export class FileUploadService {
  constructor(private readonly fileUploadRepository: FileUploadRepository, 
    @InjectRepository(Products)private readonly productsRepository: Repository<Products>
  ) {}
  
 async uploadImage(file: Express.Multer.File, productId: string) {
  const product = await this.productsRepository.findOneBy({ id: productId });

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  const uploadResponse = await this.fileUploadRepository.uploadImage(file);

  await this.productsRepository.update(product.id, {
    imgUrl: uploadResponse.secure_url,
  });

  const updatedProduct = await this.productsRepository.findOneBy({ id: productId });

  return {
    message: 'IMAGEN SUBIDA CORRECTAMENTE',
    product: updatedProduct,
  };
}
}
