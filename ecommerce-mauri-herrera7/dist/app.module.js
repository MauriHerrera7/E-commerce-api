"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("./modules/users/users.module");
const products_module_1 = require("./modules/products/products.module");
const auth_module_1 = require("./modules/auth/auth.module");
const logger_middleware_1 = require("./middleware/logger.middleware");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("./config/typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const orders_module_1 = require("./modules/orders/orders.module");
const categories_module_1 = require("./modules/categories/categories.module");
const file_upload_module_1 = require("./modules/file-upload/file-upload.module");
const jwt_1 = require("@nestjs/jwt");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, users_module_1.UsersModule, categories_module_1.CategoriesModule, products_module_1.ProductsModule,
            config_1.ConfigModule.forRoot({ isGlobal: true, load: [typeorm_1.default] }),
            typeorm_2.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => config.get('typeorm'),
            }),
            orders_module_1.OrdersModule,
            file_upload_module_1.FileUploadModule,
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1h' },
            }),],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map