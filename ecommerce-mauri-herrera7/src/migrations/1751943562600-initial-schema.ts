import { MigrationInterface, QueryRunner } from 'typeorm';

/** Baseline schema. Production uses migrations, never TypeORM synchronize. */
export class InitialSchema1751943562600 implements MigrationInterface {
  name = 'InitialSchema1751943562600';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(50) NOT NULL,
        email varchar(50) NOT NULL UNIQUE,
        password varchar(100) NOT NULL,
        phone varchar(30) NOT NULL,
        country varchar(50) NOT NULL,
        address text NOT NULL,
        city varchar(50) NOT NULL,
        "isAdmin" boolean NOT NULL DEFAULT false
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(50) NOT NULL UNIQUE
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS products (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(50) NOT NULL UNIQUE,
        description text NOT NULL,
        price numeric(10, 2) NOT NULL CHECK (price >= 0),
        stock integer NOT NULL CHECK (stock >= 0),
        "imgUrl" text NOT NULL DEFAULT 'No image',
        category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamp NOT NULL DEFAULT now(),
        status varchar(20) NOT NULL DEFAULT 'pending',
        total numeric(10, 2) NOT NULL CHECK (total >= 0),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        unit_price numeric(10, 2) NOT NULL CHECK (unit_price >= 0),
        quantity integer NOT NULL CHECK (quantity > 0),
        product_name varchar(50) NOT NULL,
        order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
        CONSTRAINT "UQ_order_items_order_product" UNIQUE (order_id, product_id)
      )
    `);
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS "IDX_products_category" ON products(category_id)',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS "IDX_orders_user" ON orders(user_id)',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS "IDX_order_items_order" ON order_items(order_id)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS order_items');
    await queryRunner.query('DROP TABLE IF EXISTS orders');
    await queryRunner.query('DROP TABLE IF EXISTS products');
    await queryRunner.query('DROP TABLE IF EXISTS categories');
    await queryRunner.query('DROP TABLE IF EXISTS users');
  }
}
