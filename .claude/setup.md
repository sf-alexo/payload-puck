# Local Project Setup for Non-Technical Users

When a user asks to "launch this project locally" or "set up and run this project", follow these steps in order.

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

## Step 4: Start the development server
Run:
```bash
pnpm dev
```

The server will start at **http://localhost:3000**.

## Step 5: Access the app
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
4. In the edit form, you'll find three relationship fields:
   - **Project Types** — Select from 14 predefined project types (e.g., AI/ML Solutions, Web Applications, Mobile Applications)
   - **Industries** — Select from 25 predefined industries (e.g., Healthcare & Pharmaceuticals, Financial Services)
   - **Tech Stack** — Select from 138 predefined technologies (e.g., React, AWS, Python)
5. Select multiple items from each category as needed
6. Save the case study

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

## Notes
- The SQLite database file (`snf-payload-poc.db`) is created automatically by Payload on first run.
- The database and `media` folder are gitignored (do not commit them).
- To stop the server, press `Ctrl+C` in the terminal.
