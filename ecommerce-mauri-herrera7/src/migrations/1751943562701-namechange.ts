import { MigrationInterface, QueryRunner } from "typeorm";

export class Namechange1751943562701 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users RENAME COLUMN name TO mauricio`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users RENAME COLUMN mauricio TO name`);
    }

}
