import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1792753135719 implements MigrationInterface {
  name = 'Init1792753135719';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(120) NOT NULL, \`email\` varchar(190) NOT NULL, \`password_hash\` varchar(100) NOT NULL, \`role\` enum ('owner', 'admin') NOT NULL DEFAULT 'owner', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`cards\` (\`code\` varchar(6) NOT NULL, \`user_id\` int NULL, \`owner_email\` varchar(190) NULL, \`name\` varchar(120) NOT NULL, \`status\` enum ('draft', 'active', 'paused') NOT NULL DEFAULT 'draft', \`destination_type\` enum ('profile', 'url', 'menu', 'form') NOT NULL DEFAULT 'profile', \`destination_url\` varchar(500) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, INDEX \`IDX_1c54b595af68cc3870b651e11c\` (\`user_id\`), INDEX \`IDX_7107fcf8f93d725547e11f903d\` (\`owner_email\`), PRIMARY KEY (\`code\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tap_events\` (\`id\` int NOT NULL AUTO_INCREMENT, \`card_code\` varchar(6) NOT NULL, \`happened_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`user_agent\` varchar(300) NULL, INDEX \`IDX_ecb4d676a394039c260fd77c9c\` (\`card_code\`, \`happened_at\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`card_requests\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(120) NOT NULL, \`business_name\` varchar(120) NOT NULL, \`email\` varchar(190) NOT NULL, \`phone\` varchar(10) NOT NULL, \`business_type\` varchar(60) NOT NULL, \`quantity\` varchar(30) NOT NULL, \`destinations\` json NOT NULL, \`city\` varchar(120) NULL, \`note\` text NULL, \`agreed\` tinyint NOT NULL DEFAULT 0, \`status\` enum ('new', 'contacted', 'fulfilled') NOT NULL DEFAULT 'new', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`change_requests\` (\`id\` int NOT NULL AUTO_INCREMENT, \`card_code\` varchar(6) NOT NULL, \`message\` varchar(500) NOT NULL, \`status\` enum ('open', 'done') NOT NULL DEFAULT 'open', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_dbcf510c3b94d544c26286bf23\` (\`card_code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`profiles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`business_name\` varchar(120) NULL, \`description\` varchar(200) NULL, \`phone\` varchar(20) NULL, \`website\` varchar(500) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_9e432b7df0d182f8d292902d1a\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cards\` ADD CONSTRAINT \`FK_1c54b595af68cc3870b651e11c9\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tap_events\` ADD CONSTRAINT \`FK_e1106d4be5d9da619b3d5d09cc5\` FOREIGN KEY (\`card_code\`) REFERENCES \`cards\`(\`code\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`change_requests\` ADD CONSTRAINT \`FK_dbcf510c3b94d544c26286bf23e\` FOREIGN KEY (\`card_code\`) REFERENCES \`cards\`(\`code\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profiles\` ADD CONSTRAINT \`FK_9e432b7df0d182f8d292902d1a2\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`profiles\` DROP FOREIGN KEY \`FK_9e432b7df0d182f8d292902d1a2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`change_requests\` DROP FOREIGN KEY \`FK_dbcf510c3b94d544c26286bf23e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tap_events\` DROP FOREIGN KEY \`FK_e1106d4be5d9da619b3d5d09cc5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cards\` DROP FOREIGN KEY \`FK_1c54b595af68cc3870b651e11c9\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_9e432b7df0d182f8d292902d1a\` ON \`profiles\``,
    );
    await queryRunner.query(`DROP TABLE \`profiles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_dbcf510c3b94d544c26286bf23\` ON \`change_requests\``,
    );
    await queryRunner.query(`DROP TABLE \`change_requests\``);
    await queryRunner.query(`DROP TABLE \`card_requests\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_ecb4d676a394039c260fd77c9c\` ON \`tap_events\``,
    );
    await queryRunner.query(`DROP TABLE \`tap_events\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_7107fcf8f93d725547e11f903d\` ON \`cards\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_1c54b595af68cc3870b651e11c\` ON \`cards\``,
    );
    await queryRunner.query(`DROP TABLE \`cards\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
