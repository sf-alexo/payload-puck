import type { CollectionConfig } from 'payload'

export const Communities: CollectionConfig = {
  slug: 'communities',
  labels: {
    singular: 'Community',
    plural: 'Communities',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Community',
  },
  defaultSort: 'name',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'city',
      type: 'text',
    },
    {
      name: 'state',
      type: 'text',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'websiteUrl',
      type: 'text',
      admin: {
        description: 'Community site URL',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
