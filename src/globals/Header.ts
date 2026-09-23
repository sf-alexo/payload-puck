import type { Field, GlobalConfig } from 'payload'

const linkFields: Field[] = [
  {
    name: 'type',
    type: 'radio',
    defaultValue: 'custom',
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
      description: 'Absolute or relative URL, e.g. /floorplans or https://example.com',
      condition: (_data, siblingData) => siblingData?.type === 'custom',
    },
  },
]

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
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo (over hero / dark)',
      admin: {
        description: 'Logo shown on the transparent header and mobile bar. Falls back to the white Revel Eagle logo.',
      },
    },
    {
      name: 'logoSolid',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo (scrolled / light)',
      admin: {
        description: 'Logo shown once the header has a white background. Falls back to the colored Revel Eagle logo.',
      },
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation Items',
      labels: {
        singular: 'Nav Item',
        plural: 'Nav Items',
      },
      fields: [
        ...linkFields,
        {
          name: 'children',
          type: 'array',
          label: 'Submenu Items',
          labels: {
            singular: 'Submenu Item',
            plural: 'Submenu Items',
          },
          admin: {
            description: 'Optional dropdown shown under this item (e.g. EXPERIENCE).',
          },
          fields: linkFields,
        },
      ],
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
      admin: {
        description: 'Shown as a call link in the header, e.g. (208) 486-0733',
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA Button Label',
      defaultValue: 'Book A Tour',
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'CTA Button URL',
      defaultValue: '/contact-us',
    },
    {
      name: 'mobileNavItems',
      type: 'array',
      label: 'Mobile-only Nav Items',
      labels: {
        singular: 'Mobile Nav Item',
        plural: 'Mobile Nav Items',
      },
      admin: {
        description: 'Extra links appended to the mobile menu (Residents, Apply, Careers, …).',
      },
      fields: linkFields,
    },
  ],
}
