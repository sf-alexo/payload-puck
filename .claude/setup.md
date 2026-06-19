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
