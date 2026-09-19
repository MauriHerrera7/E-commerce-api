import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrderIdempotencyAndUserSoftDelete1751943562800
  implements MigrationInterface
{
  name = 'OrderIdempotencyAndUserSoftDelete1751943562800';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at timestamp NULL',
    );
    await queryRunner.query(
      'ALTER TABLE orders ADD COLUMN IF NOT EXISTS idempotency_key varchar(128)',
    );
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_orders_user_idempotency_key"
      ON orders(user_id, idempotency_key)
      WHERE idempotency_key IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX IF EXISTS "UQ_orders_user_idempotency_key"',
    );
    await queryRunner.query(
      'ALTER TABLE orders DROP COLUMN IF EXISTS idempotency_key',
    );
    await queryRunner.query(
      'ALTER TABLE users DROP COLUMN IF EXISTS deleted_at',
    );
  }
}
