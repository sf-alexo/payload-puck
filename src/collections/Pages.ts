import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'parent', 'order', 'status'],
    components: {
      edit: {
        beforeDocumentControls: ['@/components/EditInPuckButton#EditInPuckButton'],
      },
      beforeListTable: ['@/components/PagesHierarchyPanel#default'],
    },
  },
  access: {
    read: () => true,
    // Prevent deletion of the protected home page (slug "home").
    delete: () => ({ slug: { not_equals: 'home' } }),
  },
  hooks: {
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        // The home page slug is locked and cannot be renamed.
        if (originalDoc?.slug === 'home') {
          data.slug = 'home'
        }

        // The home page is the root of the hierarchy and must not have a parent.
        const isHome = data.slug === 'home' || originalDoc?.slug === 'home'
        if (isHome) {
          data.parent = null
        } else if (data.parent == null) {
          // Default every other page's parent to the Home page when none is set.
          const home = await req.payload.find({
            collection: 'pages',
            where: { slug: { equals: 'home' } },
            limit: 1,
            depth: 0,
          })
          const homeId = home.docs[0]?.id
          if (homeId != null && homeId !== originalDoc?.id) {
            data.parent = homeId
          }
        }

        // A page cannot be its own parent.
        if (data.parent != null && originalDoc?.id != null && data.parent === originalDoc.id) {
          throw new Error('A page cannot be its own parent.')
        }

        // Some clients (e.g. the Payload MCP plugin's updateDocument tool)
        // serialize the `layout` JSON field to a string before saving, which
        // corrupts the json column. Coerce it back to an object on every write
        // so the value stored in the DB is always valid JSON.
        if (typeof data.layout === 'string') {
          try {
            data.layout = JSON.parse(data.layout)
          } catch {
            // Leave as-is if it isn't parseable; validation will surface it.
          }
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL path segment. The home page uses the reserved slug "home" and cannot be changed or deleted.',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      index: true,
      admin: {
        description:
          'Parent page in the site hierarchy. Leave empty for a top-level page. Used to build the sitemap/navigation tree.',
      },
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      index: true,
      admin: {
        description: 'Sort order among siblings (lower numbers appear first).',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'layout',
      type: 'json',
      admin: {
        description: 'Visual page layout produced by the Puck editor. Edit at /edit/{slug}.',
      },
    },
  ],
}
