import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { loadEnvironmentForCli, validateDbEnvironment } from './env.validation';
import { Users } from '../modules/users/entities/user.entity';
import { Products } from '../modules/products/entities/products.entity';
import { Categories } from '../modules/categories/entities/category.entity';
import { Orders } from '../modules/orders/entities/order.entity';
import { OrderItem } from '../modules/orders/entities/orderDetails.entity';

loadEnvironmentForCli();
const environment = validateDbEnvironment(process.env);

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: environment.DATABASE_URL,
  host: environment.DATABASE_URL ? undefined : environment.DB_HOST,
  port: environment.DATABASE_URL
    ? undefined
    : Number(environment.DB_PORT ?? 5432),
  username: environment.DATABASE_URL ? undefined : environment.DB_USERNAME,
  password: environment.DATABASE_URL ? undefined : environment.DB_PASSWORD,
  database: environment.DATABASE_URL ? undefined : environment.DB_NAME,
  ssl: environment.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  dropSchema: false,
  synchronize: false,
  entities: [Users, Products, Categories, Orders, OrderItem],
  migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
};

export default registerAs('database', () => dataSourceOptions);

export const AppDataSource = new DataSource(dataSourceOptions);
