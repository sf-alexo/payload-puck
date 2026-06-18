import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: await config })
    const formData = await request.formData()
    const file = formData.get('file') as File
    const alt = formData.get('alt') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const result = await payload.create({
      collection: 'media',
      data: {
        alt: alt || file.name.split('.')[0],
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
    })

    return NextResponse.json({ doc: result })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed', details: (error as Error).message },
      { status: 500 }
    )
  }
}
