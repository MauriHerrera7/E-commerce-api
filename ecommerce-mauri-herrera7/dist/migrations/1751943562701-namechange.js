"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Namechange1751943562701 = void 0;
class Namechange1751943562701 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE users RENAME COLUMN name TO mauricio`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE users RENAME COLUMN mauricio TO name`);
    }
}
exports.Namechange1751943562701 = Namechange1751943562701;
//# sourceMappingURL=1751943562701-namechange.js.map