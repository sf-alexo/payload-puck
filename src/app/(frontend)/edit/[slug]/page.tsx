import { headers as getHeaders } from 'next/headers.js'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import type { Data } from '@puckeditor/core'
import React from 'react'

import config from '@/payload.config'
import EditorClient from './EditorClient'
import type { Media } from '@/payload-types'

const emptyData: Data = { content: [], root: {} }

// Helper to resolve media IDs to URLs in Puck data
async function resolveMediaUrls(data: Data, payload: any): Promise<Data> {
  const mediaIds = new Set<number>()

  // Collect all media IDs from the data
  function collectMediaIds(obj: any) {
    if (!obj || typeof obj !== 'object') return
    if (obj.imageId) {
      const id = typeof obj.imageId === 'string' ? parseInt(obj.imageId, 10) : obj.imageId
      if (!isNaN(id)) {
        mediaIds.add(id)
      }
    }
    if (Array.isArray(obj.slides)) {
      obj.slides.forEach((slide: any) => {
        if (slide.imageId) {
          const id = typeof slide.imageId === 'string' ? parseInt(slide.imageId, 10) : slide.imageId
          if (!isNaN(id)) {
            mediaIds.add(id)
          }
        }
      })
    }
    Object.values(obj).forEach((value) => {
      if (typeof value === 'object') {
        collectMediaIds(value)
      }
    })
  }

  collectMediaIds(data)

  if (mediaIds.size === 0) return data

  // Fetch all media items
  const { docs: mediaItems } = await payload.find({
    collection: 'media',
    where: {
      id: { in: Array.from(mediaIds) },
    },
  })

  const mediaMap = new Map<number, string>()
  mediaItems.forEach((media: Media) => {
    // Prioritize filename-based URL for correct Payload media path
    if (media.filename) {
      mediaMap.set(media.id, `/api/media/file/${media.filename}`)
    } else if (media.url) {
      mediaMap.set(media.id, media.url)
    }
  })

  // Replace imageIds with URLs
  function replaceImageIds(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj
    if (Array.isArray(obj)) return obj.map(replaceImageIds)

    const newObj = { ...obj }
    if (newObj.imageId) {
      const id = typeof newObj.imageId === 'string' ? parseInt(newObj.imageId, 10) : newObj.imageId
      const url = mediaMap.get(id)
      if (url) {
        newObj.imageUrl = url
      }
    }
    if (Array.isArray(newObj.slides)) {
      newObj.slides = newObj.slides.map((slide: any) => {
        if (slide.imageId) {
          const id = typeof slide.imageId === 'string' ? parseInt(slide.imageId, 10) : slide.imageId
          const url = mediaMap.get(id)
          return { ...slide, imageUrl: url }
        }
        return slide
      })
    }
    Object.keys(newObj).forEach((key) => {
      if (typeof newObj[key] === 'object') {
        newObj[key] = replaceImageIds(newObj[key])
      }
    })
    return newObj
  }

  return replaceImageIds(data) as Data
}

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: await config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect(`/admin/login?redirect=/edit/${slug}`)
  }

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const page = result.docs[0]

  if (!page) {
    return (
      <div style={{ padding: 48, fontFamily: 'sans-serif' }}>
        <h1>Page not found</h1>
        <p>
          No page with slug <code>{slug}</code> exists. Create it first in the{' '}
          <a href="/admin/collections/pages/create">admin panel</a>, then return here.
        </p>
      </div>
    )
  }

  const initialData = (page.layout as Data | null | undefined) ?? emptyData

  // Resolve media IDs to URLs for preview
  const resolvedData = await resolveMediaUrls(initialData, payload)

  return (
    <EditorClient
      pageId={String(page.id)}
      pageTitle={page.title}
      slug={slug}
      initialData={resolvedData}
    />
  )
}
