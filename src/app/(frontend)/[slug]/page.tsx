import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { Render } from '@puckeditor/core/rsc'
import '@puckeditor/core/puck.css'
import React from 'react'

import config from '@/payload.config'
import { puckConfig, type PuckData } from '@/puck/puck.config'

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
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

  if (!data || !Array.isArray(data.content) || data.content.length === 0) {
    return (
      <div style={{ padding: 48, fontFamily: 'sans-serif', background: '#fff', color: '#0b1120' }}>
        <h1>{page.title}</h1>
        <p>This page has no layout yet. Build one in the Puck editor at <code>/edit/{slug}</code>.</p>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', color: '#0b1120', minHeight: '100vh' }}>
      <Render config={puckConfig} data={data} />
    </div>
  )
}
