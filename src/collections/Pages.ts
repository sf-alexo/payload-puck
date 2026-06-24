import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    components: {
      edit: {
        beforeDocumentControls: ['@/components/EditInPuckButton#EditInPuckButton'],
      },
    },
  },
  access: {
    read: () => true,
    // Prevent deletion of the protected home page (slug "home").
    delete: () => ({ slug: { not_equals: 'home' } }),
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        // The home page slug is locked and cannot be renamed.
        if (originalDoc?.slug === 'home') {
          data.slug = 'home'
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
