import type { CollectionConfig } from 'payload'

export const Techstacks: CollectionConfig = {
  slug: 'techstacks',
  labels: {
    singular: 'Techstack',
    plural: 'Techstacks',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Cases',
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
      unique: true,
    },
  ],
}
