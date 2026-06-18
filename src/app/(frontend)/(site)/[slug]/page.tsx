import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { Render } from '@puckeditor/core/rsc'
import '@puckeditor/core/puck.css'
import React from 'react'

import config from '@/payload.config'
import { puckConfig, type PuckData } from '@/puck/puck.config'
import type { Media } from '@/payload-types'

const asMedia = (value: unknown): Media | null =>
  value && typeof value === 'object' ? (value as Media) : null

// Helper to resolve media IDs to URLs in Puck data
async function resolveMediaUrls(data: PuckData, payload: any): Promise<PuckData> {
  console.log('resolveMediaUrls called with data:', JSON.stringify(data, null, 2))

  const mediaIds = new Set<number | string>()

  // Collect all media IDs from the data
  function collectMediaIds(obj: any) {
    if (!obj || typeof obj !== 'object') return
    if (obj.imageId) {
      // Convert string IDs to numbers for consistency
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

  console.log('Collected media IDs:', Array.from(mediaIds))

  if (mediaIds.size === 0) {
    console.log('No media IDs found, returning data as-is')
    return data
  }

  // Fetch all media items
  const { docs: mediaItems } = await payload.find({
    collection: 'media',
    where: {
      id: { in: Array.from(mediaIds) },
    },
  })

  console.log('Fetched media items:', mediaItems)

  const mediaMap = new Map<number | string, string>()
  mediaItems.forEach((media: Media) => {
    // Prioritize filename-based URL for correct Payload media path
    if (media.filename) {
      mediaMap.set(media.id, `/api/media/file/${media.filename}`)
    } else if (media.url) {
      mediaMap.set(media.id, media.url)
    }
  })

  console.log('Media map:', Array.from(mediaMap.entries()))

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

  const resolved = replaceImageIds(data) as PuckData
  console.log('Resolved data:', JSON.stringify(resolved, null, 2))
  return resolved
}

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  console.log('PublicPage called')
  const { slug } = await params

  // The home page is served at "/", so avoid duplicate content at "/home".
  if (slug === 'home') {
    redirect('/')
  }

  const payload = await getPayload({ config: await config })

  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
  })

  const page = result.docs[0]

  if (!page) {
    notFound()
  }

  const data = page.layout as PuckData | null | undefined

  console.log('Page layout data:', JSON.stringify(data, null, 2))

  if (!data || !Array.isArray(data.content) || data.content.length === 0) {
    return (
      <div style={{ padding: 48, fontFamily: 'sans-serif', background: '#fff', color: '#0b1120' }}>
        <h1>{page.title}</h1>
        <p>This page has no layout yet. Build one in the Puck editor at <code>/edit/{slug}</code>.</p>
      </div>
    )
  }

  // Resolve media IDs to URLs
  const resolvedData = await resolveMediaUrls(data, payload)

  return (
    <div style={{ background: '#fff', color: '#0b1120', minHeight: '100vh' }}>
      <Render config={puckConfig} data={resolvedData} />
    </div>
  )
}
