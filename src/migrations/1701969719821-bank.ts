import { MigrationInterface, QueryRunner } from "typeorm";

export class Bank1701969719821 implements MigrationInterface {
    name = 'Bank1701969719821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_accounts" RENAME COLUMN "bank_name" TO "bank_id"`);
        await queryRunner.query(`CREATE TABLE "banks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_3975b5f684ec241e3901db62d77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN "bank_id"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD "bank_id" uuid`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD CONSTRAINT "FK_482543ba26483726aaa00d39174" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP CONSTRAINT "FK_482543ba26483726aaa00d39174"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN "bank_id"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD "bank_id" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "banks"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" RENAME COLUMN "bank_id" TO "bank_name"`);
    }

}
