import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerDoc = new DocumentBuilder()
    .setTitle('Proyecto Backend Ecommerce')
    .setVersion('1.0.0')
    .setDescription(
    'Este proyecto consiste en el desarrollo del backend de una plataforma de e-commerce.<br/>Está construido con NestJS y utiliza una arquitectura modular para gestionar productos, categorías, usuarios, órdenes y autenticación',
    )
    .addBearerAuth()
    .build();


    const document = SwaggerModule.createDocument(app, swaggerDoc);

    SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
