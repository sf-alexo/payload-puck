import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  admin: {
    description: 'Site footer rich text. Shown on all public pages.',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      label: 'Footer Content',
    },
  ],
}
