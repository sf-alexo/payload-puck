import React from 'react'
import type { ServerProps } from 'payload'

export default async function ViewCaseStudyButton({ id, payload }: ServerProps) {
  if (!id || !payload) return null

  let slug: string | undefined
  try {
    const doc = await payload.findByID({
      collection: 'case-studies',
      id,
      depth: 0,
    })
    slug = (doc as { slug?: string })?.slug
  } catch {
    return null
  }

  if (!slug) return null

  return (
    <a
      href={`/case-studies/${slug}`}
      className="btn btn--size-medium btn--style-secondary"
      style={{ textDecoration: 'none' }}
    >
      <span className="btn__content">
        <span className="btn__label">View Case Study</span>
      </span>
    </a>
  )
}
