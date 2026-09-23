import type { CollectionConfig } from 'payload'

export const Amenities: CollectionConfig = {
  slug: 'amenities',
  labels: {
    singular: 'Amenity',
    plural: 'Amenities',
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
      name: 'community',
      type: 'relationship',
      relationTo: 'communities',
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
