# SNF Payload POC

A Payload CMS 3.0 project with Puck editor integration for visual page building. This project uses SQLite for local development and includes a rich set of components for creating dynamic web pages.

## Features

- **Payload CMS 3.0** - Headless CMS with admin panel
- **Puck Editor** - Visual page builder with drag-and-drop components
- **SQLite Database** - Local file-based database for easy development
- **Rich Text Editing** - Tiptap-based rich text with formatting support
- **Media Management** - Image upload and library selection
- **Swiper Carousel** - Responsive carousel with navigation and pagination
- **Authentication** - User authentication with admin panel access
- **Edit/View Buttons** - Quick navigation between editor and published pages for logged-in users

## Prerequisites

- **Node.js** v18 or higher
- **pnpm** package manager

## Quick Start

For detailed setup instructions, refer to [`.claude/setup.md`](.claude/setup.md) which provides step-by-step guidance for Claude agents.

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment

Copy the example environment file:

```bash
cp .env.example .env
```

The `.env` file should contain:
```
DATABASE_URL=file:./snf-payload-poc.db
PAYLOAD_SECRET=<any-random-string>
```

Generate a random `PAYLOAD_SECRET`:
- **macOS/Linux:** `openssl rand -base64 32`
- **Windows (PowerShell):** `-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})`

### 3. Create Media Folder

```bash
mkdir -p media
```

### 4. Start Development Server

```bash
pnpm dev
```

The server will start at **http://localhost:3000**

## Access Points

- **Admin Panel:** http://localhost:3000/admin
- **Public Site:** http://localhost:3000
- **Page Editor:** http://localhost:3000/edit/{slug} (e.g., /edit/home for homepage)

## Puck Editor Guide

### Creating Pages

1. **Create a page in Admin Panel:**
   - Go to http://localhost:3000/admin
   - Navigate to "Pages" collection
   - Create a new page with a title and slug (e.g., "about" for /about)

2. **Edit page with Puck:**
   - Visit http://localhost:3000/edit/{slug}
   - Drag components from the left sidebar onto the canvas
   - Configure component properties in the right panel
   - Click "Publish" to save changes

3. **View published page:**
   - Visit http://localhost:3000/{slug} (or / for homepage)
   - If logged in, you'll see "Admin Panel" and "Edit Page" buttons in the top-right corner

### Available Components

- **Hero with Image:** Title, subtitle (rich text), image, alignment
- **CTA Section:** Heading, button label, button URL
- **Rich Text:** Full rich text content with formatting
- **Carousel:** Slides with title, description (rich text), and images (uses Swiper)
- **Progress Bars:** Title and progress items with labels and values
- **Table:** Headers array and rows with comma-separated cell values

### Media Handling

- Upload images directly in the MediaField component
- Or select from existing media library via the "Library" button
- Images are stored in the Payload media collection

## Project Structure

```
src/
├── app/
│   ├── (frontend)/
│   │   ├── (site)/          # Public pages
│   │   │   ├── page.tsx     # Homepage
│   │   │   └── [slug]/      # Dynamic pages
│   │   └── edit/[slug]/     # Puck editor
│   ├── api/                 # API routes
│   └── admin/               # Admin panel
├── collections/             # Payload collections
│   ├── Users.ts
│   ├── Media.ts
│   ├── Pages.ts
│   ├── CaseStudies.ts
│   ├── Testimonials.ts
│   ├── ProjectTypes.ts      # Category: Project Types
│   ├── Industries.ts        # Category: Industries
│   └── Techstacks.ts        # Category: Techstacks
├── migrations/              # Payload database migrations
├── components/              # React components
├── puck/
│   ├── puck.config.tsx      # Puck editor configuration
│   ├── fields/              # Custom Puck fields
│   └── components/         # Puck components
└── payload.config.ts        # Payload configuration
```

## Database Migrations

This project uses Payload's **migrations** workflow. Drizzle auto-`push` is disabled in `src/payload.config.ts` (`push: false`), so schema changes are applied through migration files rather than mutating the database on startup.

After changing any collection, global, or field:

```bash
# Generate a migration from your schema changes
pnpm payload migrate:create <descriptive-name>

# Apply pending migrations
pnpm payload migrate

# Check which migrations have run
pnpm payload migrate:status
```

Migration files live in `src/migrations/` and are committed to the repo. Do **not** delete the SQLite database to apply schema changes — use migrations instead.

## Build for Production

```bash
pnpm build
```

```bash
pnpm start
```

## Notes

- The SQLite database file (`snf-payload-poc.db`) is created automatically on first run
- The database and `media` folder are gitignored (do not commit them)
- To stop the development server, press `Ctrl+C` in the terminal

## Questions

If you have any issues or questions, reach out to the Payload team on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
