import { MigrationInterface, QueryRunner } from "typeorm";

export class BankAccount1702047264677 implements MigrationInterface {
    name = 'BankAccount1702047264677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN "account_name"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN "account_type"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ALTER COLUMN "balance" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_accounts" ALTER COLUMN "balance" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD "account_type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD "account_name" character varying NOT NULL`);
    }

}
