# Local Project Setup for Non-Technical Users

When a user asks to "launch this project locally" or "set up and run this project", follow these steps in order.

---

## Claude Playbook: Guide a Non-Technical User (Run + Connect MCP)

> **For Claude/the AI agent.** This is a script for walking a NON-TECHNICAL person from a fresh repo
> to a running app with their MCP client connected. Lead them one step at a time. Run commands **for**
> them whenever possible; only ask them to do what you cannot (clicking in apps, typing passwords,
> editing a desktop app's config). Confirm each step succeeded before moving to the next.

### How to behave during onboarding
- **One step at a time.** Never paste a wall of commands. Do a step, verify it, then continue.
- **Run commands yourself** in the terminal instead of asking them to type. Say plainly what you're
  doing and why, in everyday language ("I'm starting the website on your computer").
- **Check, don't assume.** After each step, verify with a command or by asking what they see on screen.
- **On errors**, read it, fix it if you can, and explain simply. Don't dump raw stack traces on them.
- **Protect secrets.** The `PAYLOAD_SECRET` and the MCP API key are sensitive — don't expose them
  unnecessarily in chat.

### Phase 0 — Prerequisites
Run these and interpret the results for the user:
```bash
node -v      # need v18.20.2+ or v20.9.0+
pnpm -v      # need v9 or v10
```
- If `node` is missing → point them to https://nodejs.org (download the LTS), wait until installed.
- If `pnpm` is missing → run `corepack enable` (preferred) or `npm install -g pnpm`.
- Confirm they're in the project folder: run `pwd` and `ls`, check you can see `package.json`.

### Phase 1 — Install dependencies
```bash
pnpm install
```
Tell them: "I'm downloading what the project needs — this takes a minute or two." Success ends with
"Done". Most failures are a Node version mismatch (fix Phase 0) or no internet.

### Phase 2 — Environment file
- If `.env` is missing, create it from the example: `cp .env.example .env`.
- Ensure it contains exactly:
  ```
  DATABASE_URL=file:./snf-payload-poc.db
  PAYLOAD_SECRET=<any-random-string>
  ```
- If `PAYLOAD_SECRET` is empty/placeholder, generate one with `openssl rand -base64 32` and write it in.
  (`.env.example` may show a MongoDB URL — this project uses the SQLite `file:` URL above.)

### Phase 3 — Create the media folder
```bash
mkdir -p media
```
Explain: "This is where uploaded images will live."

### Phase 4 — Create the database (REQUIRED)
The database file is not included in the repo, so it must be built from migrations:
```bash
pnpm payload migrate
```
Explain: "I'm setting up the project's database." If it asks about having run in dev mode, on a fresh
setup it's safe to answer **yes**. Verify with `pnpm payload migrate:status` (all rows say "Yes").

### Phase 5 — Start the app
Start the dev server (non-blocking) and wait for "Ready":
```bash
pnpm dev
```
Tell them: "Your site is now running. Open http://localhost:3000 in your browser." Then have them:
1. Visit **http://localhost:3000/admin** and **create the first user** (this becomes the admin).
   Ask them to do this — they choose the email/password. Wait for confirmation they're logged in.

### Phase 6 — Create their MCP API key
Guide them through the admin UI (you can't click for them):
1. In the admin panel, find **MCP → API Keys** in the left sidebar.
2. Click **Create New**.
3. Turn ON the capabilities they want the AI to have (for the page/content workflows, enable the
   `pages` and `case-studies` options; enabling all is fine for a demo).
4. Click **Create** and **copy the generated key**.
Ask them to paste the key back to you so you can finish the connection (or keep it for the config).

### Phase 7 — Connect their MCP client
Pick the client they use. The full configs are in **"MCP Server (AI-Assisted Editing)"** below.
- **Claude Desktop** → follow "Connecting Claude Desktop (step-by-step)". You give them the exact JSON
  (with their key) and the config file location; they paste it and restart the app.
- **Cursor / Windsurf** → use the HTTP config (`serverUrl` + `Authorization: Bearer <key>` header).
After they add it and refresh/restart, verify: the client should list the **payload** server with
`findPages` and `updatePages`. You can also confirm the server is healthy yourself:
```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST 'http://localhost:3000/api/mcp' \
  -H 'Authorization: Bearer THEIR-KEY' -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":"1","method":"tools/list","params":{}}'
```
`200` = working. `401` = wrong/disabled key. Connection refused = `pnpm dev` not running.

### Phase 8 — Celebrate + show them what to try
Tell them it's connected and give 1–2 example prompts they can try from their client, e.g.
"Find the home page and show its block order" or "Create a case study about <topic> and use an image
from the library as the cover."

### Quick recap (the whole happy path)
```bash
pnpm install
cp .env.example .env      # then set DATABASE_URL=file:./snf-payload-poc.db and a PAYLOAD_SECRET
mkdir -p media
pnpm payload migrate
pnpm dev
```
Then: create admin user → MCP → API Keys → create key → add server to their MCP client → restart.

---

## Prerequisites
- Ensure **Node.js** (v18+) and **pnpm** are installed. If not, guide the user to install them first.

## Step 1: Install dependencies
Run this in the project root:
```bash
pnpm install
```

## Step 2: Create environment file
If `.env` does not exist, copy `.env.example` to `.env`:

**macOS/Linux:**
```bash
cp .env.example .env
```

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**Windows (Command Prompt):**
```cmd
copy .env.example .env
```

The `.env` file should contain:
```
DATABASE_URL=file:./snf-payload-poc.db
PAYLOAD_SECRET=<any-random-string>
```
Generate a random `PAYLOAD_SECRET` if needed:
- **macOS/Linux:** `openssl rand -base64 32`
- **Windows (PowerShell):** `-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})`
- **Or use any online random string generator**

## Step 3: Create media folder
Payload stores uploaded files in a `media` folder. Create it if missing:

**macOS/Linux:**
```bash
mkdir -p media
```

**Windows (PowerShell):**
```powershell
New-Item -ItemType Directory -Path media -Force
```

**Windows (Command Prompt):**
```cmd
if not exist media mkdir media
```

## Step 4: Run database migrations (REQUIRED on a fresh clone)
The SQLite database file is **gitignored**, so when you pull the repo you start with **no database**. This project has Drizzle auto-`push` disabled (`push: false` in `src/payload.config.ts`), which means the schema is created **only** by running the committed migrations. Run them before starting the app:

```bash
pnpm payload migrate
```

This creates `snf-payload-poc.db` (if missing) and applies every migration in `src/migrations/`, including the `payload-mcp-api-keys` table used by the MCP plugin. On first run the app also auto-seeds the home page and the category collections (see "Seeded Data").

- If prompted "It looks like you've run Payload in dev mode … would you like to proceed?", that warning only matters on a database that was previously dev-pushed. On a brand-new clone there's no data to lose — answer **yes**.
- Check status anytime with `pnpm payload migrate:status`.
- **Do not delete the `.db` file** to fix schema issues — run migrations instead.

## Step 5: Start the development server
Run:
```bash
pnpm dev
```

The server will start at **http://localhost:3000**.

## Step 6: Access the app
- **Admin panel:** http://localhost:3000/admin
- **Public site:** http://localhost:3000

The first user created in the admin panel will be the admin user.

## Database Migrations

This project uses Payload's **migrations** workflow (Drizzle `push` is disabled in `src/payload.config.ts` via `push: false`). After changing any collection, global, or field, generate and run a migration instead of relying on auto-push.

### Create a migration after schema changes
```bash
pnpm payload migrate:create <descriptive-name>
```
This writes a new migration file to `src/migrations/`.

### Apply pending migrations
```bash
pnpm payload migrate
```

### Check migration status
```bash
pnpm payload migrate:status
```

### Notes
- Do **not** delete the SQLite database to apply schema changes — use migrations.
- Migration files in `src/migrations/` are committed to the repo.
- If you ever see an error like `index ... already exists` on startup, it means push was attempting to mutate the schema. Ensure `push: false` is set and use the migration commands above.

## Seeded Data

The following category collections are automatically seeded on first app startup if they are empty:

### ProjectTypes (14 entries)
AI/ML Solutions, Automation, Cloud Solutions, CMS Development & Migration, DevOps & Infrastructure, Healthcare & Pharmaceuticals, Landing Pages & Websites, Maintenance & Support, Mobile Applications, PoC & MVP Development, Product Enhancement, Solution Architecture, Staff Augmentation, Web Applications

### Industries (25 entries)
Arts & Crafts, Automotive, Construction, Consulting, Design & Architecture, Education, Financial Services, Food & Restaurants, Government & Public Sector, Healthcare & Pharmaceuticals, Information Technology & Services, Insurance, Manufacturing, Marketing & Communications, Media & Entertainment, Non-profit & NGOs, Real Estate, Retail & E-commerce, Sports, Staffing & Recruiting, Technology & Software Development, Telecommunications, Training & Coaching, Transportation & Logistics, Travel & Hospitality

### Techstacks (138 entries)
Active Admin, Agora, Algolia, Angular, Apache Airflow, ApostropheCMS, ASP.NET, AWS (and AWS CloudFront, CloudWatch, EC2, ECS, IAM, Lambda, RDS, S3, WAF), Azure, Babel, BigCommerce, Bootstrap, Boto3, C Sharp, C Plus Plus, CakePHP, Carrierwave, Cascade CMS, Claude API, Claude Projects, ColdFusion, Context isolation, Cordova, Craft CMS, CSS, cURL, Custom Twitter Stream Integration, D3, Devise, DigitalOcean, Django, Docker, Drupal, Elasticsearch, Express.js, FastAPI, Flask, Flutter, Gemini, Git, GitHub, GitLab, Go, Google Analytics, Google Maps API, Google Workspace, Grafana, GraphQL, Heroku, HighCharts, HTML, HubSpot API, Image Optimization Tools, Ionic, Java, JavaScript, jQuery, Kafka, Keras, Koa, Laravel, Leaflet, less, LookerStudio, Magento, Mapbox, MariaDB, MediaWiki, Microsoft Office Add-ins Development Kit, MongoDB, MySQL, N8N, Netlify, NewRelic, Next.JS, Nginx, Nib, NodeJS, Objective-c, OpenAI GPT, OpenSearch, OpenTok, Pantheon, Papertrail, PayPal, PHP, Pinecone, Plaid API, PostgreSQL, Prometheus, Python, PyTorch, RabbitMQ, RAG, React, React Native, Redis, Redux, RSpec, RSS, Ruby, Ruby on Rails, Salesforce DX, Sass, Sembly AI, Shopify, Solr, Spring Boot, Stripe, Tailwind, Tealium AudienceStream, Tealium EventStream, Tealium IQ, TensorFlow, Terraform, TL;DV, Twig, Twilio, TypeScript, VEEVA, Vue, Webpack, WebRTC, WebSockets, Woocommerce, WordPress, XML-structured system prompt, Yii, Zabbix

### Notes
- Seeding happens automatically in the `onInit` hook in `src/payload.config.ts`
- Collections are only seeded if they are empty (count = 0)
- To reseed a collection, delete all its entries from the admin panel or via SQLite, then restart the dev server
- All three collections have `defaultSort: 'name'` so they display alphabetically in the admin dashboard
- Category collections do not have slug fields since they don't need public pages
- All case study related collections (Case Studies, Project Types, Industries, Techstacks) are grouped under "Cases" in the admin panel

## Case Studies and Categories

### Assigning Categories to Case Studies
1. Go to the Admin Panel at http://localhost:3000/admin
2. Navigate to "Case Studies" collection
3. Edit or create a case study
4. In the edit form, you'll find three relationship fields in the "Basics" section:
   - **Project Types** — Select from 14 predefined project types (e.g., AI/ML Solutions, Web Applications, Mobile Applications)
   - **Industries** — Select from 25 predefined industries (e.g., Healthcare & Pharmaceuticals, Financial Services)
   - **Tech Stack** — Select from 138 predefined technologies (e.g., React, AWS, Python)
5. Select multiple items from each category as needed
6. Save the case study

### Case Study Fields

The Case Studies collection has the following fields organized in two collapsible sections:

#### Basics
- **Title** — Required text field, used as the document title
- **Slug** — Required unique text field for URL routing
- **Portfolio Title** — Optional text field for portfolio display
- **Descriptor** — Optional text field for a brief description
- **Summary** — Optional textarea for a short summary
- **Client Website** — Optional text field for client website URL
- **Link to Prod** — Optional text field for production/live site URL
- **Full Story URL** — Optional text field for full case study URL
- **Project Types** — Relationship field to select project types
- **Industries** — Relationship field to select industries
- **Tech Stack** — Relationship field to select technologies
- **Cover Image** — Upload field for the case study cover image
- **Testimonials** — Relationship field to select testimonials

#### Details
- **Objective** — Optional textarea for the project objective
- **Challenge** — Optional textarea for the challenge faced
- **Solution** — Optional textarea for the solution implemented
- **Result** — Optional textarea for the results achieved

### Viewing Categories on Case Study Pages
When viewing a case study at `/case-studies/{slug}`, the assigned categories are displayed below the title with color-coded badges:
- **Project Types** — Blue badges
- **Industries** — Green badges
- **Tech Stack** — Gray badges

Categories are only shown if at least one item is assigned to the case study.

## Puck Editor Guide

### Creating and Editing Pages
1. **Create a page in Admin Panel:**
   - Go to http://localhost:3000/admin
   - Navigate to "Pages" collection
   - Create a new page with a title and slug (e.g., "about" for /about)

2. **Edit page with Puck:**
   - Visit http://localhost:3000/edit/{slug} (e.g., /edit/home for homepage)
   - You'll be redirected to login if not authenticated
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
- **Table:** Headers array and rows with cell arrays for tabular data

### Media Handling
- Upload images directly in the MediaField component
- Or select from existing media library via the "Library" button
- Images are stored in the Payload media collection

### Rich Text Editing
- Rich text fields support bold, italic, and other formatting
- Content is stored as HTML and rendered safely on the frontend

## MCP Server (AI-Assisted Editing)

The project includes the official `@payloadcms/plugin-mcp` plugin, which exposes a Model Context Protocol (MCP) endpoint at `POST /api/mcp`. This lets an AI client (Claude Desktop, Cursor, etc.) read and edit CMS content through structured tools instead of UI clicks.

### What's enabled
The `pages` collection is exposed with these capabilities (configured in `src/payload.config.ts`):
- **find** — read pages, including the full Puck `layout` JSON tree.
- **update** — save changes back to a page.
- **create / delete** — disabled via MCP (pages are created/removed only in the admin UI).

The plugin also auto-adds a `payload-mcp-api-keys` collection (admin group **MCP**) for issuing API keys.

### Puck layout editing workflow
Each page stores its Puck drag-and-drop layout in the `layout` JSON field, shaped as `{ root, content, zones }` where `content` is an ordered array of blocks (Hero, CTA, RichText, Carousel, Bars, Table). The AI flow is:
1. AI calls `findDocuments` (pages) to pull a page by `id` or `slug`.
2. AI edits/reorders the `layout.content` array (each item has a `type` and `props`).
3. AI calls `updateDocument` (pages) to push the modified `layout` back.
4. Refresh `http://localhost:3000/edit/{slug}` to see the blocks in their new positions.

Example prompt: _"Find the page with slug `home`, move the Hero block to the top of its layout, and save."_

### Step 1: Create an MCP API key
This plugin version requires a Bearer API key on every request (even in development).
1. Go to `http://localhost:3000/admin` → **MCP → API Keys** → **Create New**.
2. Allow the capabilities you want the key to use (e.g. the `pages` find/update).
3. Click **Create** and copy the generated key.

### Step 2: Connect an MCP client
**Native HTTP (Claude Desktop / Cursor):**
```json
{
  "mcpServers": {
    "Payload": {
      "type": "http",
      "url": "http://localhost:3000/api/mcp",
      "headers": { "Authorization": "Bearer YOUR-MCP-API-KEY" }
    }
  }
}
```

**Via `mcp-remote` (for clients without native HTTP support):**
```json
{
  "mcpServers": {
    "Payload": {
      "command": "npx",
      "args": [
        "-y", "mcp-remote",
        "http://127.0.0.1:3000/api/mcp",
        "--header", "Authorization: Bearer YOUR-MCP-API-KEY"
      ]
    }
  }
}
```

### Connecting Claude Desktop (step-by-step)
Claude Desktop is the most common client for this project. Each person uses **their own** MCP API key.

**Prerequisites**
- The dev server is running (`pnpm dev`) so `http://localhost:3000/api/mcp` is reachable.
- You created your own key in `/admin` → **MCP → API Keys** (see Step 1 above) and enabled the capabilities you need.
- **Node.js is installed** (Claude Desktop runs `npx`).

**1. Open the Claude Desktop config file**
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

You can also reach it from the app: **Settings → Developer → Edit Config**. If the file doesn't exist, create it.

**2. Add the Payload server.** Claude Desktop connects over stdio, so use the `mcp-remote` adapter to bridge to our HTTP endpoint. Merge this into the file (keep any existing servers):
```json
{
  "mcpServers": {
    "payload": {
      "command": "npx",
      "args": [
        "-y", "mcp-remote",
        "http://127.0.0.1:3000/api/mcp",
        "--header", "Authorization: Bearer YOUR-MCP-API-KEY"
      ]
    }
  }
}
```
Replace `YOUR-MCP-API-KEY` with the key you generated.

**3. Restart Claude Desktop** completely (quit and reopen — config is read on launch).

**4. Verify.** In a new chat, click the tools/connector icon. You should see the **payload** server with the `findPages` and `updatePages` tools. Try: _"Use the payload MCP to find the page with slug `home` and show its block order."_

**Alternative — stdio with no dev server / no API key (local only):** Claude Desktop can run the bundled `payload-mcp` bin directly against your local Payload install. This skips the HTTP server and the API key, but spawns its own process that opens the SQLite file, so **stop `pnpm dev` first** to avoid write-lock conflicts:
```json
{
  "mcpServers": {
    "payload": {
      "command": "npx",
      "args": ["payload-mcp"],
      "env": {
        "PAYLOAD_CONFIG_PATH": "/ABSOLUTE/PATH/TO/snf-payload-poc/src/payload.config.ts",
        "DATABASE_URL": "file:/ABSOLUTE/PATH/TO/snf-payload-poc/snf-payload-poc.db",
        "PAYLOAD_SECRET": "your-payload-secret-from-.env",
        "PAYLOAD_MCP_OVERRIDE_ACCESS": "true"
      }
    }
  }
}
```
Use absolute paths so it works regardless of Claude Desktop's working directory.

**Troubleshooting**
- **Tools don't appear:** fully quit and relaunch Claude Desktop; tools load on startup.
- **401 Unauthorized (HTTP/`mcp-remote` mode):** the API key is wrong/disabled, or its capabilities are off — recreate it in `/admin` → MCP → API Keys.
- **Connection refused (HTTP mode):** `pnpm dev` isn't running, or the port differs from 3000.
- **stdio mode errors about config/DB:** check the absolute paths and that you ran `pnpm payload migrate` at least once.

### Testing the endpoint
List available tools with curl (replace the key):
```bash
curl -i 'http://localhost:3000/api/mcp' \
  -X POST \
  -H 'Authorization: Bearer YOUR-MCP-API-KEY' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":"1","method":"tools/list","params":{}}'
```
A request without a valid key returns `401 Unauthorized` — this is expected.

### Migrations note
The plugin adds the `payload-mcp-api-keys` collection. Because `push: false` is set, its table is created by the committed migration `src/migrations/20260624_132754_add_mcp_api_keys.ts`. Run `pnpm payload migrate` if setting up a fresh database.

## Notes
- The SQLite database file (`snf-payload-poc.db`) is created automatically by Payload on first run.
- The database and `media` folder are gitignored (do not commit them).
- To stop the server, press `Ctrl+C` in the terminal.
