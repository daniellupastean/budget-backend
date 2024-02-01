import { MigrationInterface, QueryRunner } from 'typeorm';

export class Limits1706291017386 implements MigrationInterface {
  name = 'Limits1706291017386';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "limits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" integer NOT NULL, "bank_account_id" uuid, CONSTRAINT "REL_5c8835caf71fbd5c283d1f18c7" UNIQUE ("bank_account_id"), CONSTRAINT "PK_5735b3428b0889ce4fa5ae7db89" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "limits" ADD CONSTRAINT "FK_5c8835caf71fbd5c283d1f18c76" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "limits" DROP CONSTRAINT "FK_5c8835caf71fbd5c283d1f18c76"`,
    );
    await queryRunner.query(`DROP TABLE "limits"`);
  }
}
