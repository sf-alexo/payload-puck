import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Communities } from './collections/Communities'
import { FloorPlans } from './collections/FloorPlans'
import { Amenities } from './collections/Amenities'
import { Events } from './collections/Events'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { revelEagleLayout } from './puck/revelEagleLayout'
import { FOOTER_DEFAULTS, HEADER_DEFAULTS } from './components/siteChromeDefaults'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      actions: ['@/components/LogoutButton#LogoutButton'],
    },
  },
  collections: [
    Users,
    Media,
    Pages,
    Communities,
    FloorPlans,
    Amenities,
    Events,
  ],
  globals: [Header, Footer],
  onInit: async (payload) => {
    // Ensure a protected, editable home page always exists (slug "home").
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
      limit: 1,
    })
    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'pages',
        data: {
          title: 'Home',
          slug: 'home',
          status: 'published',
          layout: { content: [], root: {} },
        },
      })
    }

    const revelEagle = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'revel-eagle' } },
      limit: 1,
    })
    if (revelEagle.docs.length === 0) {
      await payload.create({
        collection: 'pages',
        data: {
          title: 'Revel Eagle',
          slug: 'revel-eagle',
          status: 'published',
          layout: revelEagleLayout,
        },
      })
    }

    // Upload a file from public/ into the media collection once. Never throws:
    // on serverless the public dir may not exist in the function bundle, and
    // the header/footer fall back to the public asset paths anyway.
    const ensureMedia = async (filename: string, alt: string) => {
      try {
        const found = await payload.find({
          collection: 'media',
          where: { filename: { equals: filename } },
          limit: 1,
        })
        if (found.docs[0]) return found.docs[0].id
        const created = await payload.create({
          collection: 'media',
          data: { alt },
          filePath: path.resolve(dirname, '../public', filename),
        })
        return created.id
      } catch {
        return undefined
      }
    }

    // Seed Header/Footer globals with the Revel Eagle content if empty. Never
    // throws — a DB that hasn't run the latest migration yet shouldn't stop boot.
    try {
      // Seed Header global with the Revel Eagle navigation if it has no items yet.
      const headerGlobal = await payload.findGlobal({ slug: 'header' })
      if (!headerGlobal.navItems?.length) {
        const logoId = await ensureMedia('revel-eagle-logo-white.png', 'Revel Eagle logo (white)')
        const logoSolidId = await ensureMedia('revel-eagle-logo.png', 'Revel Eagle logo')
        await payload.updateGlobal({
          slug: 'header',
          data: {
            logo: logoId,
            logoSolid: logoSolidId,
            navItems: HEADER_DEFAULTS.navItems.map((item) => ({
              type: 'custom' as const,
              label: item.label,
              url: item.url,
              children: (item.children ?? []).map((child) => ({
                type: 'custom' as const,
                label: child.label,
                url: child.url,
              })),
            })),
            phone: HEADER_DEFAULTS.phone,
            ctaLabel: HEADER_DEFAULTS.ctaLabel,
            ctaUrl: HEADER_DEFAULTS.ctaUrl,
            mobileNavItems: HEADER_DEFAULTS.mobileNavItems.map((item) => ({
              type: 'custom' as const,
              label: item.label,
              url: item.url,
            })),
          },
        })
      }

      // Seed Footer global with the Revel Eagle footer content if empty.
      const footerGlobal = await payload.findGlobal({ slug: 'footer' })
      if (!footerGlobal.address && !footerGlobal.communityLinks?.length) {
        const footerLogoId = await ensureMedia('revel-logo-white.png', 'Revel logo')
        await payload.updateGlobal({
          slug: 'footer',
          data: {
            logo: footerLogoId,
            logoUrl: FOOTER_DEFAULTS.logoUrl,
            address: FOOTER_DEFAULTS.address,
            phone: FOOTER_DEFAULTS.phone,
            socialLinks: FOOTER_DEFAULTS.socialLinks.map((link) => ({
              platform: link.platform as 'facebook' | 'instagram' | 'x' | 'linkedin' | 'youtube',
              url: link.url,
            })),
            communityLinks: FOOTER_DEFAULTS.communityLinks,
            policyLinks: FOOTER_DEFAULTS.policyLinks,
            privacyText: FOOTER_DEFAULTS.privacyText,
            privacyLinkLabel: FOOTER_DEFAULTS.privacyLinkLabel,
            privacyLinkUrl: FOOTER_DEFAULTS.privacyLinkUrl,
          },
        })
      }
    } catch (error) {
      payload.logger.warn({ err: error }, 'Skipping header/footer global seeding')
    }

    // Seed Community collections (Communities/FloorPlans/Amenities/Events).
    // Wrapped in try/catch — a DB that hasn't run the latest migration yet
    // shouldn't stop boot.
    try {
      const communities = await payload.find({ collection: 'communities', limit: 1 })
      if (communities.docs.length === 0) {
        const revelEagleCommunity = await payload.create({
          collection: 'communities',
          data: {
            name: 'Revel Eagle',
            slug: 'revel-eagle',
            city: 'Eagle',
            state: 'ID',
            address: '745 E Riverside Dr\nEagle, ID 83616',
            phone: '(208) 486-0733',
            websiteUrl: 'https://revelcommunities.com/revel-eagle/',
            description:
              'Independent senior living community in Eagle, Idaho offering apartment homes, resort-style amenities, chef-prepared dining, and an active social lifestyle.',
            image: await ensureMedia('hero-revel-eagle-0523-1-1024x683.jpg', 'Revel Eagle'),
          },
        })

        for (const community of [
          { name: 'Revel Province', slug: 'revel-province', city: 'Colorado Springs', state: 'CO' },
          { name: 'Revel Rancharrah', slug: 'revel-rancharrah', city: 'Reno', state: 'NV' },
          { name: 'Revel Folsom', slug: 'revel-folsom', city: 'Folsom', state: 'CA' },
          { name: 'Revel Issaquah', slug: 'revel-issaquah', city: 'Issaquah', state: 'WA' },
          { name: 'Revel Lodi', slug: 'revel-lodi', city: 'Lodi', state: 'CA' },
        ]) {
          await payload.create({ collection: 'communities', data: community })
        }

        const floorplans = await payload.find({ collection: 'floorplans', limit: 1 })
        if (floorplans.docs.length === 0) {
          for (const plan of [
            { name: 'Studio A', bedrooms: 'studio', bathrooms: '1', sqft: 558, price: 3275 },
            { name: 'One Bedroom B', bedrooms: '1', bathrooms: '1', sqft: 712, price: 3955 },
            { name: 'One Bedroom C', bedrooms: '1', bathrooms: '1', sqft: 825, price: 4195 },
            { name: 'Two Bedroom D', bedrooms: '2', bathrooms: '2', sqft: 1104, price: 4895 },
          ] as const) {
            await payload.create({
              collection: 'floorplans',
              data: { ...plan, community: revelEagleCommunity.id },
            })
          }
        }

        const amenities = await payload.find({ collection: 'amenities', limit: 1 })
        if (amenities.docs.length === 0) {
          for (const amenity of [
            { name: 'The Salon', image: 'revel-eagle-salon-1024x683.jpg' },
            { name: 'Theater', image: 'revel-eagle-theater-room-1024x683.jpg' },
            { name: 'Fitness Studio', image: 'revel-eagle-fitness-studio-1-1024x673.jpg' },
            { name: 'The Spa', image: 'revel-eagle-spa-1024x683.jpg' },
            { name: 'Revel Room', image: 'revel-eagle-revel-room-1-1024x640.jpg' },
            { name: 'Pickleball Court', image: 'revel-eagle-pickleball-court-1-1024x683.jpg' },
          ]) {
            await payload.create({
              collection: 'amenities',
              data: {
                name: amenity.name,
                community: revelEagleCommunity.id,
                image: await ensureMedia(amenity.image, amenity.name),
              },
            })
          }
        }

        const events = await payload.find({ collection: 'events', limit: 1 })
        if (events.docs.length === 0) {
          for (const event of [
            {
              title: 'The White Queen - TV Series',
              start: '2026-09-22T18:30:00.000Z',
              end: '2026-09-22T19:30:00.000Z',
              location: 'Revel Eagle',
            },
            {
              title: 'Outing: To Bruneau Sand Dunes & Lunch',
              start: '2026-09-23T09:00:00.000Z',
              end: '2026-09-23T17:00:00.000Z',
              location: 'Bruneau Sand Dunes',
            },
            {
              title: 'Resident Monthly Movie: The Devil Wears Prada 2',
              start: '2026-09-23T11:30:00.000Z',
              end: '2026-09-23T13:00:00.000Z',
              location: 'Revel Eagle Theater',
            },
          ]) {
            await payload.create({
              collection: 'events',
              data: { ...event, community: revelEagleCommunity.id },
            })
          }
        }
      }
    } catch (error) {
      payload.logger.warn({ err: error }, 'Skipping community collections seeding')
    }
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    push: false,
    client: {
      url: process.env.DATABASE_URL || '',
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  sharp,
  plugins: [
    mcpPlugin({
      collections: {
        // Primary target for the AI page-layout workflow. The Puck drag-and-drop
        // tree lives in the `layout` JSON field of each Pages document. The AI
        // uses `findDocuments` to read a page, reorders/edits the Puck JSON, then
        // `updateDocument` to push it back. Refreshing /edit/{slug} reflects it.
        pages: {
          description:
            'Site pages. The `layout` field holds the Puck visual-editor JSON tree (a `{ root, content, zones }` object where `content` is an ordered array of blocks like Hero, CTA, RichText, Carousel, Bars, Table, RevelHero, MembershipRates, ResidentTestimonials, FloorPlans, LifestylePillars, CulinaryFeature, AmenitiesGrid, CommunityGallery, TourCTA, FAQAccordion). Use findDocuments to read a page by id or slug (it returns the full `layout` JSON), reorder/edit the `layout.content` array (each item has a `type` and `props`), then updateDocument to push the whole `layout` object back. Reordering array elements changes block order; refreshing /edit/{slug} reflects the change.',
          // Allow reading, creating and editing pages. Deletion stays disabled so the
          // protected home page (slug "home") can never be removed via MCP.
          enabled: {
            create: true,
            delete: false,
            find: true,
            update: true,
          },
        },
        // Full CRUD enabled for all content collections so the AI can create and
        // edit any collection's documents via MCP.
        media: {
          enabled: { create: true, delete: true, find: true, update: true },
        },
        communities: {
          enabled: { create: true, delete: true, find: true, update: true },
        },
        floorplans: {
          enabled: { create: true, delete: true, find: true, update: true },
        },
        amenities: {
          enabled: { create: true, delete: true, find: true, update: true },
        },
        events: {
          enabled: { create: true, delete: true, find: true, update: true },
        },
        users: {
          enabled: { create: true, delete: true, find: true, update: true },
        },
      },
    }),
    // Uploads go to Vercel Blob when BLOB_READ_WRITE_TOKEN is set (production);
    // otherwise media falls back to the local media/ directory for dev.
    vercelBlobStorage({
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
