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
        /* Make drawer item names always visible */
        [class*="DrawerItem-name"] {
          color: #0b1120 !important;
          opacity: 1 !important;
        }
      `}</style>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          background: '#0b1120',
          color: '#fff',
          fontSize: '0.9rem',
        }}
      >
        <span>
          Editing: <strong>{pageTitle}</strong>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {status && <span>{status}</span>}
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
        </div>
      </div>
      <style>{`
        .view-page-button:hover {
          background: #334155;
        }
      `}</style>
      <Puck config={puckConfig} data={initialData} onPublish={handlePublish} />
    </div>
  )
}
