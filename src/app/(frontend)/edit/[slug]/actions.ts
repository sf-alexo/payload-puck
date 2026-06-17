'use server'

import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function savePageLayout(pageId: string, layout: Record<string, unknown>) {
  const payload = await getPayload({ config: await config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user) {
    throw new Error('Not authenticated')
  }

  await payload.update({
    collection: 'pages',
    id: pageId,
    data: { layout },
  })

  return { success: true }
}
