import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './modules/orders/orders.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { JwtModule } from '@nestjs/jwt';
import { validateEnvironment } from './config/env.validation';
import { HealthModule } from './modules/health/health.module';
import { SecurityMiddleware } from './common/middleware/security.middleware';
import type { StringValue } from 'ms';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: ['.env.local', '.env'],
      validate: validateEnvironment,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.getOrThrow('database'),
    }),
    OrdersModule,
    FileUploadModule,
    HealthModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '15m') as StringValue,
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityMiddleware, LoggerMiddleware).forRoutes('*');
  }
}
