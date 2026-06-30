import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE \`pages\` ADD \`parent_id\` integer REFERENCES pages(id) ON UPDATE no action ON DELETE set null;`,
  )
  await db.run(sql`ALTER TABLE \`pages\` ADD \`order\` numeric DEFAULT 0;`)
  await db.run(sql`CREATE INDEX \`pages_parent_idx\` ON \`pages\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_order_idx\` ON \`pages\` (\`order\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`pages_order_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`pages_parent_idx\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`order\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`parent_id\`;`)
}
