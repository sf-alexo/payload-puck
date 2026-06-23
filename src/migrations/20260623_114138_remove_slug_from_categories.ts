import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`project_types_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`project_types\` DROP COLUMN \`slug\`;`)
  await db.run(sql`DROP INDEX \`industries_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`industries\` DROP COLUMN \`slug\`;`)
  await db.run(sql`DROP INDEX \`techstacks_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`techstacks\` DROP COLUMN \`slug\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`project_types\` ADD \`slug\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`project_types_slug_idx\` ON \`project_types\` (\`slug\`);`)
  await db.run(sql`ALTER TABLE \`industries\` ADD \`slug\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`industries_slug_idx\` ON \`industries\` (\`slug\`);`)
  await db.run(sql`ALTER TABLE \`techstacks\` ADD \`slug\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`techstacks_slug_idx\` ON \`techstacks\` (\`slug\`);`)
}
