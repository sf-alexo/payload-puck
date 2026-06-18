import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import type { Media } from '@/payload-types'

export const metadata = {
  title: 'Case Studies',
}

const asMedia = (value: unknown): Media | null =>
  value && typeof value === 'object' ? (value as Media) : null

export default async function CaseStudiesPage() {
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'case-studies',
    depth: 1,
    limit: 100,
    sort: 'title',
  })

  return (
    <div style={{ background: '#fff', color: '#0b1120', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: 8 }}>Case Studies</h1>
        <p style={{ opacity: 0.7, marginTop: 0 }}>{docs.length} case studies</p>

        {docs.length === 0 ? (
          <p>
            No case studies yet. Create some in the{' '}
            <a href="/admin/collections/case-studies">admin panel</a>.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 24,
              marginTop: 32,
            }}
          >
            {docs.map((cs) => {
              const cover = asMedia(cs.coverImage)
              return (
                <Link
                  key={cs.id}
                  href={`/case-studies/${cs.slug}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    overflow: 'hidden',
                    textDecoration: 'none',
                    color: 'inherit',
                    background: '#fff',
                  }}
                >
                  {cover?.url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover.url}
                      alt={cover.alt || cs.title}
                      style={{ width: '100%', height: 160, objectFit: 'cover' }}
                    />
                  )}
                  <div style={{ padding: 16 }}>
                    <h2 style={{ fontSize: '1.2rem', margin: '0 0 8px' }}>{cs.title}</h2>
                    {cs.summary && (
                      <p style={{ fontSize: '0.95rem', opacity: 0.75, margin: 0 }}>
                        {cs.summary}
                      </p>
                    )}
                    {cs.tags && cs.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                        {cs.tags.map((t) => (
                          <span
                            key={t.id || t.tag}
                            style={{
                              fontSize: '0.75rem',
                              background: '#f1f5f9',
                              padding: '2px 8px',
                              borderRadius: 999,
                            }}
                          >
                            {t.tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
