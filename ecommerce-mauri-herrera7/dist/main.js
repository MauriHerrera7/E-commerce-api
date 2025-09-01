"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const swaggerDoc = new swagger_1.DocumentBuilder()
        .setTitle('Proyecto Backend Ecommerce')
        .setVersion('1.0.0')
        .setDescription('Este proyecto consiste en el desarrollo del backend de una plataforma de e-commerce.<br/>Está construido con NestJS y utiliza una arquitectura modular para gestionar productos, categorías, usuarios, órdenes y autenticación')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerDoc);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map