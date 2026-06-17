import { headers as getHeaders } from 'next/headers.js'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import type { Data } from '@puckeditor/core'
import React from 'react'

import config from '@/payload.config'
import EditorClient from './EditorClient'

const emptyData: Data = { content: [], root: {} }

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

  return (
    <EditorClient
      pageId={String(page.id)}
      pageTitle={page.title}
      initialData={initialData}
    />
  )
}
