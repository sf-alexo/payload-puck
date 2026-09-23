import type { Field, GlobalConfig } from 'payload'

const linkListFields: Field[] = [
  {
    name: 'label',
    type: 'text',
    required: true,
  },
  {
    name: 'url',
    type: 'text',
    required: true,
    admin: {
      description: 'Absolute or relative URL, e.g. /case-studies or https://example.com',
    },
  },
]

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  admin: {
    description: 'Site footer content. Shown on all public pages.',
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Footer Logo',
      admin: {
        description: 'Logo shown in the first column. Falls back to the white Revel logo.',
      },
    },
    {
      name: 'logoUrl',
      type: 'text',
      label: 'Logo Link URL',
      defaultValue: 'https://revelcommunities.com/',
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Address',
      admin: {
        description: 'One line per address row, e.g. "745 E Riverside Dr" then "Eagle, ID 83616".',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
      admin: {
        description: 'Shown as a call link, e.g. (208) 486-0733',
      },
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      labels: {
        singular: 'Social Link',
        plural: 'Social Links',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          defaultValue: 'facebook',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'X (Twitter)', value: 'x' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'communityLinks',
      type: 'array',
      label: 'Community Links',
      labels: {
        singular: 'Community Link',
        plural: 'Community Links',
      },
      admin: {
        description: 'Third column links (states / other communities).',
      },
      fields: linkListFields,
    },
    {
      name: 'policyLinks',
      type: 'array',
      label: 'Policy Links',
      labels: {
        singular: 'Policy Link',
        plural: 'Policy Links',
      },
      admin: {
        description: 'Fourth column links (Terms & Conditions, Privacy Policy, …).',
      },
      fields: linkListFields,
    },
    {
      name: 'privacyText',
      type: 'text',
      label: 'Privacy Choices Text',
      defaultValue: 'Your California Privacy Choices',
    },
    {
      name: 'privacyLinkLabel',
      type: 'text',
      label: 'Privacy Link Label',
      defaultValue: 'California Notice at Collection',
    },
    {
      name: 'privacyLinkUrl',
      type: 'text',
      label: 'Privacy Link URL',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Extra Footer Content',
      admin: {
        description: 'Optional rich text rendered below the footer columns.',
      },
    },
  ],
}
