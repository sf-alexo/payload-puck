import type { CollectionConfig } from 'payload'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    group: 'Cases',
    components: {
      edit: {
        beforeDocumentControls: ['@/components/admin/ViewCaseStudyButton'],
      },
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Basics',
      fields: [
        {
          name: 'title',
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
          name: 'portfolioTitle',
          type: 'text',
        },
        {
          name: 'descriptor',
          type: 'text',
        },
        {
          name: 'summary',
          type: 'textarea',
        },
        {
          name: 'clientWebsite',
          type: 'text',
          admin: {
            description: 'Client website URL',
          },
        },
        {
          name: 'linkToProd',
          type: 'text',
          admin: {
            description: 'Link to production/live site',
          },
        },
        {
          name: 'fullStoryUrl',
          type: 'text',
          admin: {
            description: 'Full story/case study URL',
          },
        },
        {
          name: 'projectTypes',
          type: 'relationship',
          relationTo: 'project-types',
          hasMany: true,
        },
        {
          name: 'industries',
          type: 'relationship',
          relationTo: 'industries',
          hasMany: true,
        },
        {
          name: 'techstacks',
          type: 'relationship',
          relationTo: 'techstacks',
          hasMany: true,
        },
        {
          name: 'coverImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'testimonials',
          type: 'relationship',
          relationTo: 'testimonials',
          hasMany: true,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Details',
      fields: [
        {
          name: 'objective',
          type: 'textarea',
        },
        {
          name: 'challenge',
          type: 'textarea',
        },
        {
          name: 'solution',
          type: 'textarea',
        },
        {
          name: 'result',
          type: 'textarea',
        },
      ],
    },
  ],
}
