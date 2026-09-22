'use client'

import React, { useState, useEffect } from 'react'

type MediaFieldProps = {
  value: string | undefined
  onChange: (value: string | undefined) => void
}

type MediaItem = {
  id: number | string
  filename: string
  url: string
  alt?: string
}

export default function MediaField({ value, onChange }: MediaFieldProps) {
  const [altText, setAltText] = useState('')
  const [showLibrary, setShowLibrary] = useState(false)
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([])
  const [loadingLibrary, setLoadingLibrary] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Fetch media details for preview when value changes
  useEffect(() => {
    if (value) {
      fetch(`/api/media/${value}`)
        .then(res => res.json())
        .then(data => {
          if (data.doc?.url) {
            setPreviewUrl(data.doc.url)
          } else if (data.doc?.filename) {
            setPreviewUrl(`/api/media/file/${data.doc.filename}`)
          }
        })
        .catch(err => {
          console.error('Failed to fetch media for preview:', err)
          setPreviewUrl(null)
        })
    } else {
      queueMicrotask(() => setPreviewUrl(null))
    }
  }, [value])

  // Fetch media library when library is opened
  useEffect(() => {
    if (showLibrary && mediaLibrary.length === 0) {
      queueMicrotask(() => setLoadingLibrary(true))
      fetch('/api/media?limit=50')
        .then(res => res.json())
        .then(data => {
          if (data.docs) {
            setMediaLibrary(data.docs)
          }
        })
        .catch(err => console.error('Failed to fetch media library:', err))
        .finally(() => setLoadingLibrary(false))
    }
  }, [showLibrary, mediaLibrary.length])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const altValue = altText.trim() || file.name.split('.')[0]

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt', altValue)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to upload media: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      onChange(data.doc.id)
    } catch (err) {
      console.error('Upload error:', err)
      alert(`Failed to upload media: ${(err as Error).message}`)
    }
  }

  const handleSelectFromLibrary = (media: MediaItem) => {
    onChange(String(media.id))
    setShowLibrary(false)
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: '0.875rem' }}>
        Media
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          type="text"
          placeholder="Alt text (required for upload)"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            fontSize: '0.875rem',
          }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            fontSize: '0.875rem',
          }}
        />
        <button
          type="button"
          onClick={() => setShowLibrary(!showLibrary)}
          style={{
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            fontSize: '0.875rem',
            background: '#f8fafc',
            cursor: 'pointer',
          }}
        >
          {showLibrary ? 'Close' : 'Library'}
        </button>
        {value && (
          <span
            style={{
              padding: '4px 8px',
              background: '#10b981',
              color: '#fff',
              borderRadius: 4,
              fontSize: '0.75rem',
              alignSelf: 'flex-start',
            }}
          >
            ID: {value}
          </span>
        )}
      </div>

      {showLibrary && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            maxHeight: 300,
            overflowY: 'auto',
            background: '#fff',
          }}
        >
          {loadingLibrary ? (
            <div style={{ padding: 16, textAlign: 'center', color: '#64748b' }}>
              Loading media library...
            </div>
          ) : mediaLibrary.length === 0 ? (
            <div style={{ padding: 16, textAlign: 'center', color: '#64748b' }}>
              No media items found
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
              {mediaLibrary.map((media) => (
                <div
                  key={media.id}
                  onClick={() => handleSelectFromLibrary(media)}
                  style={{
                    cursor: 'pointer',
                    border: value === String(media.id) ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    borderRadius: 6,
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <img
                    src={media.url}
                    alt={media.alt || media.filename}
                    style={{
                      width: '100%',
                      height: 80,
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <div
                    style={{
                      padding: 4,
                      fontSize: '0.7rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      background: '#f8fafc',
                    }}
                  >
                    {media.filename}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {previewUrl && (
        <div style={{ marginTop: 8 }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: 200, maxHeight: 150, objectFit: 'cover', borderRadius: 8 }}
          />
        </div>
      )}
    </div>
  )
}
