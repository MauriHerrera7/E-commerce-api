import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { loadEnvironmentForCli, validateEnvironment } from './env.validation';
import { Users } from '../modules/users/entities/user.entity';
import { Products } from '../modules/products/entities/products.entity';
import { Categories } from '../modules/categories/entities/category.entity';
import { Orders } from '../modules/orders/entities/order.entity';
import { OrderItem } from '../modules/orders/entities/orderDetails.entity';

loadEnvironmentForCli();
const environment = validateEnvironment(process.env);

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: environment.DB_HOST,
  port: Number(environment.DB_PORT ?? 5432),
  username: environment.DB_USERNAME,
  password: environment.DB_PASSWORD,
  database: environment.DB_NAME,
  ssl: environment.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  dropSchema: false,
  synchronize: false,
  entities: [Users, Products, Categories, Orders, OrderItem],
  migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
};

export default registerAs('database', () => dataSourceOptions);

export const AppDataSource = new DataSource(dataSourceOptions);
