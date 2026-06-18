import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  admin: {
    description: 'Site header navigation. Shown on all public pages.',
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation Items',
      labels: {
        singular: 'Nav Item',
        plural: 'Nav Items',
      },
      fields: [
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'page',
          options: [
            { label: 'Page', value: 'page' },
            { label: 'Custom URL', value: 'custom' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            condition: (_data, siblingData) => siblingData?.type === 'page',
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'Absolute or relative URL, e.g. /case-studies or https://example.com',
            condition: (_data, siblingData) => siblingData?.type === 'custom',
          },
        },
      ],
    },
  ],
}
