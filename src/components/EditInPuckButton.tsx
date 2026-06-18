'use client'

import React from 'react'
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'

export const EditInPuckButton: React.FC = () => {
  const { id } = useDocumentInfo()
  const slug = useFormFields(([fields]) => fields?.slug?.value as string | undefined)

  // Only show once the document is saved and has a slug to target.
  if (!id || !slug) return null

  return (
    <a
      href={`/edit/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: '#2563eb',
        color: '#fff',
        padding: '0 16px',
        height: 38,
        borderRadius: 'var(--style-radius-m, 6px)',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
      title="Open the visual Puck editor for this page"
    >
      Edit visually
    </a>
  )
}

export default EditInPuckButton
