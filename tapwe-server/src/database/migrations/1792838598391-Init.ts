import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1792838598391 implements MigrationInterface {
  name = 'Init1792838598391';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('owner', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(120) NOT NULL, "email" character varying(190) NOT NULL, "password_hash" character varying(100) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'owner', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."cards_status_enum" AS ENUM('draft', 'active', 'paused')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."cards_destination_type_enum" AS ENUM('profile', 'url', 'menu', 'form')`,
    );
    await queryRunner.query(
      `CREATE TABLE "cards" ("code" character varying(6) NOT NULL, "user_id" integer, "owner_email" character varying(190), "name" character varying(120) NOT NULL, "status" "public"."cards_status_enum" NOT NULL DEFAULT 'draft', "destination_type" "public"."cards_destination_type_enum" NOT NULL DEFAULT 'profile', "destination_url" character varying(500), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_af8c1e25df58bc35de84c8e54e8" PRIMARY KEY ("code"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1c54b595af68cc3870b651e11c" ON "cards" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7107fcf8f93d725547e11f903d" ON "cards" ("owner_email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "tap_events" ("id" SERIAL NOT NULL, "card_code" character varying(6) NOT NULL, "happened_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_agent" character varying(300), CONSTRAINT "PK_72a09013ce23e42dadb57622d09" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ecb4d676a394039c260fd77c9c" ON "tap_events" ("card_code", "happened_at") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."card_requests_status_enum" AS ENUM('new', 'contacted', 'fulfilled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "card_requests" ("id" SERIAL NOT NULL, "name" character varying(120) NOT NULL, "business_name" character varying(120) NOT NULL, "email" character varying(190) NOT NULL, "phone" character varying(10) NOT NULL, "business_type" character varying(60) NOT NULL, "quantity" character varying(30) NOT NULL, "destinations" jsonb NOT NULL, "city" character varying(120), "note" text, "agreed" boolean NOT NULL DEFAULT false, "status" "public"."card_requests_status_enum" NOT NULL DEFAULT 'new', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9338dfcc37c364cdd78c191da07" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."change_requests_status_enum" AS ENUM('open', 'done')`,
    );
    await queryRunner.query(
      `CREATE TABLE "change_requests" ("id" SERIAL NOT NULL, "card_code" character varying(6) NOT NULL, "message" character varying(500) NOT NULL, "status" "public"."change_requests_status_enum" NOT NULL DEFAULT 'open', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e3f28255a6e818820f18f6d5956" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dbcf510c3b94d544c26286bf23" ON "change_requests" ("card_code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "profiles" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "business_name" character varying(120), "description" character varying(200), "phone" character varying(20), "website" character varying(500), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_9e432b7df0d182f8d292902d1a" UNIQUE ("user_id"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cards" ADD CONSTRAINT "FK_1c54b595af68cc3870b651e11c9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tap_events" ADD CONSTRAINT "FK_e1106d4be5d9da619b3d5d09cc5" FOREIGN KEY ("card_code") REFERENCES "cards"("code") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_requests" ADD CONSTRAINT "FK_dbcf510c3b94d544c26286bf23e" FOREIGN KEY ("card_code") REFERENCES "cards"("code") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    // Only the API uses these tables; RLS with no policies hides them from Supabase's public REST API.
    for (const table of [
      'users',
      'cards',
      'tap_events',
      'card_requests',
      'change_requests',
      'profiles',
    ]) {
      await queryRunner.query(
        `ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profiles" DROP CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_requests" DROP CONSTRAINT "FK_dbcf510c3b94d544c26286bf23e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tap_events" DROP CONSTRAINT "FK_e1106d4be5d9da619b3d5d09cc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cards" DROP CONSTRAINT "FK_1c54b595af68cc3870b651e11c9"`,
    );
    await queryRunner.query(`DROP TABLE "profiles"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dbcf510c3b94d544c26286bf23"`,
    );
    await queryRunner.query(`DROP TABLE "change_requests"`);
    await queryRunner.query(`DROP TYPE "public"."change_requests_status_enum"`);
    await queryRunner.query(`DROP TABLE "card_requests"`);
    await queryRunner.query(`DROP TYPE "public"."card_requests_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ecb4d676a394039c260fd77c9c"`,
    );
    await queryRunner.query(`DROP TABLE "tap_events"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7107fcf8f93d725547e11f903d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1c54b595af68cc3870b651e11c"`,
    );
    await queryRunner.query(`DROP TABLE "cards"`);
    await queryRunner.query(`DROP TYPE "public"."cards_destination_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."cards_status_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
