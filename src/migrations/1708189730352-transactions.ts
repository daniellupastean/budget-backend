import { MigrationInterface, QueryRunner } from "typeorm";

export class Transactions1708189730352 implements MigrationInterface {
    name = 'Transactions1708189730352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "description" SET NOT NULL`);
    }

}
