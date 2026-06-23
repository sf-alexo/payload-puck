import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`case_studies\` ADD \`portfolio_title\` text;`)
  await db.run(sql`ALTER TABLE \`case_studies\` ADD \`descriptor\` text;`)
  await db.run(sql`ALTER TABLE \`case_studies\` ADD \`client_website\` text;`)
  await db.run(sql`ALTER TABLE \`case_studies\` ADD \`link_to_prod\` text;`)
  await db.run(sql`ALTER TABLE \`case_studies\` ADD \`full_story_url\` text;`)
  await db.run(sql`ALTER TABLE \`case_studies\` ADD \`objective\` text;`)
  await db.run(sql`ALTER TABLE \`case_studies\` ADD \`challenge\` text;`)
  await db.run(sql`ALTER TABLE \`case_studies\` ADD \`solution\` text;`)
  await db.run(sql`ALTER TABLE \`case_studies\` ADD \`result\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`portfolio_title\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`descriptor\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`client_website\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`link_to_prod\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`full_story_url\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`objective\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`challenge\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`solution\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`result\`;`)
}
