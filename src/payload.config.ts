import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
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
  ],
})
