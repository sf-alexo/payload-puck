'use client'

import React, { useState } from 'react'
import { Puck, type Data } from '@puckeditor/core'
import '@puckeditor/core/puck.css'
import { puckConfig } from '@/puck/puck.config'
import { savePageLayout } from './actions'

type EditorClientProps = {
  pageId: string
  pageTitle: string
  slug: string
  initialData: Data
}

export default function EditorClient({ pageId, pageTitle, slug, initialData }: EditorClientProps) {
  const [status, setStatus] = useState<string>('')

  const handlePublish = async (data: Data) => {
    setStatus('Saving...')
    try {
      await savePageLayout(pageId, data as unknown as Record<string, unknown>)
      setStatus('Saved')
      setTimeout(() => setStatus(''), 2000)
    } catch (err) {
      setStatus(`Error: ${(err as Error).message}`)
    }
  }

  const viewUrl = slug === 'home' ? '/' : `/${slug}`

  return (
    <div style={{ height: '100vh' }}>
      <style>{`
        /* Make drawer item names always visible and wrap long labels */
        [class*="DrawerItem-name"] {
          color: #0b1120 !important;
          opacity: 1 !important;
          font-size: 0.8rem !important;
          white-space: normal !important;
          overflow-wrap: anywhere !important;
          word-break: break-word !important;
          line-height: 1.1 !important;
        }
        /* Arrange drawer (Blocks) items in a 2-column grid */
        [class*="Drawer_"] {
          display: grid !important;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
          gap: 8px !important;
        }
        /* Make each drawer item smaller and prevent overflow */
        [class*="DrawerItem_"] {
          min-width: 0 !important;
        }
        [class*="DrawerItem-draggable"] {
          padding: 8px !important;
          min-width: 0 !important;
        }
        .view-page-button:hover {
          background: #334155;
        }
      `}</style>
      <Puck
        config={puckConfig}
        data={initialData}
        onPublish={handlePublish}
        headerTitle={`Editing: ${pageTitle}`}
        overrides={{
          headerActions: ({ children }) => (
            <>
              <a
                href={viewUrl}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 16px',
                  background: '#1e293b',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: 6,
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
                className="view-page-button"
              >
                View Page
              </a>
              {status && (
                <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.85rem' }}>
                  {status}
                </span>
              )}
              {children}
            </>
          ),
        }}
      />
    </div>
  )
}
