import { MigrationInterface, QueryRunner } from "typeorm";

export class Bank1705511240861 implements MigrationInterface {
    name = 'Bank1705511240861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banks" ADD "is_deleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banks" DROP COLUMN "is_deleted"`);
    }

}
