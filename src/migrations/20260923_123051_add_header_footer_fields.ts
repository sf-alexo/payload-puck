import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`header_nav_items_children\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'custom',
  	\`label\` text NOT NULL,
  	\`page_id\` integer,
  	\`url\` text,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_nav_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`header_nav_items_children_order_idx\` ON \`header_nav_items_children\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`header_nav_items_children_parent_id_idx\` ON \`header_nav_items_children\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`header_nav_items_children_page_idx\` ON \`header_nav_items_children\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`header_mobile_nav_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'custom',
  	\`label\` text NOT NULL,
  	\`page_id\` integer,
  	\`url\` text,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`header_mobile_nav_items_order_idx\` ON \`header_mobile_nav_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`header_mobile_nav_items_parent_id_idx\` ON \`header_mobile_nav_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`header_mobile_nav_items_page_idx\` ON \`header_mobile_nav_items\` (\`page_id\`);`)
  await db.run(sql`CREATE TABLE \`footer_social_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`platform\` text DEFAULT 'facebook' NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_social_links_order_idx\` ON \`footer_social_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_social_links_parent_id_idx\` ON \`footer_social_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`footer_community_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_community_links_order_idx\` ON \`footer_community_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_community_links_parent_id_idx\` ON \`footer_community_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`footer_policy_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_policy_links_order_idx\` ON \`footer_policy_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_policy_links_parent_id_idx\` ON \`footer_policy_links\` (\`_parent_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_header_nav_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'custom',
  	\`label\` text NOT NULL,
  	\`page_id\` integer,
  	\`url\` text,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_header_nav_items\`("_order", "_parent_id", "id", "type", "label", "page_id", "url") SELECT "_order", "_parent_id", "id", "type", "label", "page_id", "url" FROM \`header_nav_items\`;`)
  await db.run(sql`DROP TABLE \`header_nav_items\`;`)
  await db.run(sql`ALTER TABLE \`__new_header_nav_items\` RENAME TO \`header_nav_items\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`header_nav_items_order_idx\` ON \`header_nav_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`header_nav_items_parent_id_idx\` ON \`header_nav_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`header_nav_items_page_idx\` ON \`header_nav_items\` (\`page_id\`);`)
  await db.run(sql`ALTER TABLE \`header\` ADD \`logo_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`header\` ADD \`logo_solid_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`header\` ADD \`phone\` text;`)
  await db.run(sql`ALTER TABLE \`header\` ADD \`cta_label\` text DEFAULT 'Book A Tour';`)
  await db.run(sql`ALTER TABLE \`header\` ADD \`cta_url\` text DEFAULT '/contact-us';`)
  await db.run(sql`CREATE INDEX \`header_logo_idx\` ON \`header\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`header_logo_solid_idx\` ON \`header\` (\`logo_solid_id\`);`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`logo_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`logo_url\` text DEFAULT 'https://revelcommunities.com/';`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`address\` text;`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`phone\` text;`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`privacy_text\` text DEFAULT 'Your California Privacy Choices';`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`privacy_link_label\` text DEFAULT 'California Notice at Collection';`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`privacy_link_url\` text;`)
  await db.run(sql`CREATE INDEX \`footer_logo_idx\` ON \`footer\` (\`logo_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`header_nav_items_children\`;`)
  await db.run(sql`DROP TABLE \`header_mobile_nav_items\`;`)
  await db.run(sql`DROP TABLE \`footer_social_links\`;`)
  await db.run(sql`DROP TABLE \`footer_community_links\`;`)
  await db.run(sql`DROP TABLE \`footer_policy_links\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_header\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_header\`("id", "updated_at", "created_at") SELECT "id", "updated_at", "created_at" FROM \`header\`;`)
  await db.run(sql`DROP TABLE \`header\`;`)
  await db.run(sql`ALTER TABLE \`__new_header\` RENAME TO \`header\`;`)
  await db.run(sql`CREATE TABLE \`__new_footer\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_footer\`("id", "content", "updated_at", "created_at") SELECT "id", "content", "updated_at", "created_at" FROM \`footer\`;`)
  await db.run(sql`DROP TABLE \`footer\`;`)
  await db.run(sql`ALTER TABLE \`__new_footer\` RENAME TO \`footer\`;`)
  await db.run(sql`CREATE TABLE \`__new_header_nav_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'page',
  	\`label\` text NOT NULL,
  	\`page_id\` integer,
  	\`url\` text,
  	FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_header_nav_items\`("_order", "_parent_id", "id", "type", "label", "page_id", "url") SELECT "_order", "_parent_id", "id", "type", "label", "page_id", "url" FROM \`header_nav_items\`;`)
  await db.run(sql`DROP TABLE \`header_nav_items\`;`)
  await db.run(sql`ALTER TABLE \`__new_header_nav_items\` RENAME TO \`header_nav_items\`;`)
  await db.run(sql`CREATE INDEX \`header_nav_items_order_idx\` ON \`header_nav_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`header_nav_items_parent_id_idx\` ON \`header_nav_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`header_nav_items_page_idx\` ON \`header_nav_items\` (\`page_id\`);`)
}
