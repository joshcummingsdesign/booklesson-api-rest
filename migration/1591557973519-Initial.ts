import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1591557973519 implements MigrationInterface {
    name = 'Initial1591557973519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lesson" ("id" SERIAL NOT NULL, "studentId" integer NOT NULL, "teacherId" integer NOT NULL, "date" character varying NOT NULL, "time" character varying NOT NULL, CONSTRAINT "PK_0ef25918f0237e68696dee455bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "availability" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "date" character varying NOT NULL, "time" character varying NOT NULL, "available" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_05a8158cf1112294b1c86e7f1d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "instrument" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth" ("userId" integer NOT NULL, "password" character varying NOT NULL, CONSTRAINT "REL_373ead146f110f04dad6084815" UNIQUE ("userId"), CONSTRAINT "PK_373ead146f110f04dad60848154" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "FK_a67245be78e8fc70268144d64b5" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "FK_5b70ab4b9466eb06172dc279941" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "FK_42a42b693f05f17e56d1d9ba93f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "FK_373ead146f110f04dad60848154" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "FK_373ead146f110f04dad60848154"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT "FK_42a42b693f05f17e56d1d9ba93f"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "FK_5b70ab4b9466eb06172dc279941"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "FK_a67245be78e8fc70268144d64b5"`);
        await queryRunner.query(`DROP TABLE "auth"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "availability"`);
        await queryRunner.query(`DROP TABLE "lesson"`);
    }

}
