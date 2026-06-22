import type { CollectionConfig } from 'payload'

export const Techstacks: CollectionConfig = {
  slug: 'techstacks',
  labels: {
    singular: 'Techstack',
    plural: 'Techstacks',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Categories',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
    },
  ],
}
