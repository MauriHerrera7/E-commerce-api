import { MigrationInterface, QueryRunner } from 'typeorm';

export class Namechange1751943562701 implements MigrationInterface {
  /** Kept as a no-op to preserve the identifier used by older local databases. */
  public async up(_queryRunner: QueryRunner): Promise<void> {
    await Promise.resolve(_queryRunner);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    await Promise.resolve(_queryRunner);
  }
}
