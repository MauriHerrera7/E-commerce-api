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

@Module({
  imports: [AuthModule,UsersModule, CategoriesModule, ProductsModule,
  ConfigModule.forRoot({isGlobal: true, load:[typeorm]}),
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => config.get('typeorm')!,
  }),
  OrdersModule,
  FileUploadModule,
  JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h' },
  }),
  ],
  controllers: [],
  providers: [],
})

export class AppModule implements NestModule{
 configure(consumer: MiddlewareConsumer) {
   consumer.apply(LoggerMiddleware).forRoutes('*');
   
 }
}
