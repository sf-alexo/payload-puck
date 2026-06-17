'use client'

import React, { useState } from 'react'
import { Puck, type Data } from '@puckeditor/core'
import '@puckeditor/core/puck.css'
import { puckConfig } from '@/puck/puck.config'
import { savePageLayout } from './actions'

type EditorClientProps = {
  pageId: string
  pageTitle: string
  initialData: Data
}

export default function EditorClient({ pageId, pageTitle, initialData }: EditorClientProps) {
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

  return (
    <div style={{ height: '100vh' }}>
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
        {status && <span>{status}</span>}
      </div>
      <Puck config={puckConfig} data={initialData} onPublish={handlePublish} />
    </div>
  )
}
