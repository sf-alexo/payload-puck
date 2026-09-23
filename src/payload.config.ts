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
import { CaseStudies } from './collections/CaseStudies'
import { Testimonials } from './collections/Testimonials'
import { ProjectTypes } from './collections/ProjectTypes'
import { Industries } from './collections/Industries'
import { Techstacks } from './collections/Techstacks'
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
    CaseStudies,
    Testimonials,
    ProjectTypes,
    Industries,
    Techstacks,
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

    // Seed Industries if empty
    const industries = await payload.find({
      collection: 'industries',
      limit: 1,
    })
    if (industries.docs.length === 0) {
      const industryNames = [
        'Arts & Crafts',
        'Automotive',
        'Construction',
        'Consulting',
        'Design & Architecture',
        'Education',
        'Financial Services',
        'Food & Restaurants',
        'Government & Public Sector',
        'Healthcare & Pharmaceuticals',
        'Information Technology & Services',
        'Insurance',
        'Manufacturing',
        'Marketing & Communications',
        'Media & Entertainment',
        'Non-profit & NGOs',
        'Real Estate',
        'Retail & E-commerce',
        'Sports',
        'Staffing & Recruiting',
        'Technology & Software Development',
        'Telecommunications',
        'Training & Coaching',
        'Transportation & Logistics',
        'Travel & Hospitality',
      ]

      for (const name of industryNames) {
        await payload.create({
          collection: 'industries',
          data: { name },
        })
      }
    }

    // Seed ProjectTypes if empty
    const projectTypes = await payload.find({
      collection: 'project-types',
      limit: 1,
    })
    if (projectTypes.docs.length === 0) {
      const projectTypeNames = [
        'AI/ML Solutions',
        'Automation',
        'Cloud Solutions',
        'CMS Development & Migration',
        'DevOps & Infrastructure',
        'Healthcare & Pharmaceuticals',
        'Landing Pages & Websites',
        'Maintenance & Support',
        'Mobile Applications',
        'PoC & MVP Development',
        'Product Enhancement',
        'Solution Architecture',
        'Staff Augmentation',
        'Web Applications',
      ]

      for (const name of projectTypeNames) {
        await payload.create({
          collection: 'project-types',
          data: { name },
        })
      }
    }

    // Seed Techstacks if empty
    const techstacks = await payload.find({
      collection: 'techstacks',
      limit: 1,
    })
    if (techstacks.docs.length === 0) {
      const techstackNames = [
        'Active Admin',
        'Agora',
        'Algolia',
        'Angular',
        'Apache Airflow',
        'ApostropheCMS',
        'ASP.NET',
        'AWS',
        'AWS CloudFront',
        'AWS CloudWatch',
        'AWS EC2',
        'AWS ECS',
        'AWS IAM',
        'AWS Lambda',
        'AWS RDS',
        'AWS S3',
        'AWS WAF',
        'Azure',
        'Babel',
        'BigCommerce',
        'Bootstrap',
        'Boto3',
        'C Sharp',
        'C Plus Plus',
        'CakePHP',
        'Carrierwave',
        'Cascade CMS',
        'Claude API',
        'Claude Projects',
        'ColdFusion',
        'Context isolation',
        'Cordova',
        'Craft CMS',
        'CSS',
        'cURL',
        'Custom Twitter Stream Integration',
        'D3',
        'Devise',
        'DigitalOcean',
        'Django',
        'Docker',
        'Drupal',
        'Elasticsearch',
        'Express.js',
        'FastAPI',
        'Flask',
        'Flutter',
        'Gemini',
        'Git',
        'GitHub',
        'GitLab',
        'Go',
        'Google Analytics',
        'Google Maps API',
        'Google Workspace',
        'Grafana',
        'GraphQL',
        'Heroku',
        'HighCharts',
        'HTML',
        'HubSpot API',
        'Image Optimization Tools',
        'Ionic',
        'Java',
        'JavaScript',
        'jQuery',
        'Kafka',
        'Keras',
        'Koa',
        'Laravel',
        'Leaflet',
        'less',
        'LookerStudio',
        'Magento',
        'Mapbox',
        'MariaDB',
        'MediaWiki',
        'Microsoft Office Add-ins Development Kit',
        'MongoDB',
        'MySQL',
        'N8N',
        'Netlify',
        'NewRelic',
        'Next.JS',
        'Nginx',
        'Nib',
        'NodeJS',
        'Objective-c',
        'OpenAI GPT',
        'OpenSearch',
        'OpenTok',
        'Pantheon',
        'Papertrail',
        'PayPal',
        'PHP',
        'Pinecone',
        'Plaid API',
        'PostgreSQL',
        'Prometheus',
        'Python',
        'PyTorch',
        'RabbitMQ',
        'RAG',
        'React',
        'React Native',
        'Redis',
        'Redux',
        'RSpec',
        'RSS',
        'Ruby',
        'Ruby on Rails',
        'Salesforce DX',
        'Sass',
        'Sembly AI',
        'Shopify',
        'Solr',
        'Spring Boot',
        'Stripe',
        'Tailwind',
        'Tealium AudienceStream',
        'Tealium EventStream',
        'Tealium IQ',
        'TensorFlow',
        'Terraform',
        'TL;DV',
        'Twig',
        'Twilio',
        'TypeScript',
        'VEEVA',
        'Vue',
        'Webpack',
        'WebRTC',
        'WebSockets',
        'Woocommerce',
        'WordPress',
        'XML-structured system prompt',
        'Yii',
        'Zabbix',
      ]

      await Promise.all(
        techstackNames.map(async (name) => {
          await payload.create({
            collection: 'techstacks',
            data: { name },
          })
        })
      )
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
        'case-studies': {
          enabled: { create: true, delete: true, find: true, update: true },
        },
        testimonials: {
          enabled: { create: true, delete: true, find: true, update: true },
        },
        'project-types': {
          enabled: { create: true, delete: true, find: true, update: true },
        },
        industries: {
          enabled: { create: true, delete: true, find: true, update: true },
        },
        techstacks: {
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
