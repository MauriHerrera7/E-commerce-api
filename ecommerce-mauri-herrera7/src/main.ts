import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableShutdownHooks();
  const corsOrigins = configService.get<string>('CORS_ORIGINS');
  if (corsOrigins) {
    app.enableCors({
      origin: corsOrigins.split(',').map((origin) => origin.trim()),
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    });
  }
  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerDoc = new DocumentBuilder()
    .setTitle('Proyecto Backend Ecommerce')
    .setVersion('1.0.0')
    .setDescription(
      'Este proyecto consiste en el desarrollo del backend de una plataforma de e-commerce.<br/>Está construido con NestJS y utiliza una arquitectura modular para gestionar productos, categorías, usuarios, órdenes y autenticación',
    )
    .addBearerAuth()
    .build();

  if (configService.get<string>('ENABLE_SWAGGER', 'false') === 'true') {
    const document = SwaggerModule.createDocument(app, swaggerDoc);
    SwaggerModule.setup('api', app, document);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );
  await app.listen(configService.get<number>('PORT', 3000), '0.0.0.0');
}
void bootstrap();
