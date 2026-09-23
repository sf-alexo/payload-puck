import type { CollectionConfig } from 'payload'

export const FloorPlans: CollectionConfig = {
  slug: 'floorplans',
  labels: {
    singular: 'Floor Plan',
    plural: 'Floor Plans',
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
      name: 'bedrooms',
      type: 'select',
      options: [
        { label: 'Studio', value: 'studio' },
        { label: '1 Bedroom', value: '1' },
        { label: '2 Bedrooms', value: '2' },
        { label: '3 Bedrooms', value: '3' },
      ],
    },
    {
      name: 'bathrooms',
      type: 'select',
      options: [
        { label: '1 Bath', value: '1' },
        { label: '1.5 Baths', value: '1.5' },
        { label: '2 Baths', value: '2' },
        { label: '2.5 Baths', value: '2.5' },
        { label: '3 Baths', value: '3' },
      ],
    },
    {
      name: 'sqft',
      type: 'number',
      label: 'Square Feet',
    },
    {
      name: 'price',
      type: 'number',
      label: 'Monthly Price',
    },
    {
      name: 'available',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
