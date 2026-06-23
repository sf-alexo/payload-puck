import type { CollectionConfig } from 'payload'

export const Industries: CollectionConfig = {
  slug: 'industries',
  labels: {
    singular: 'Industry',
    plural: 'Industries',
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
