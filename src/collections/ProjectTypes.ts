import type { CollectionConfig } from 'payload'

export const ProjectTypes: CollectionConfig = {
  slug: 'project-types',
  labels: {
    singular: 'Project Type',
    plural: 'Project Types',
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
