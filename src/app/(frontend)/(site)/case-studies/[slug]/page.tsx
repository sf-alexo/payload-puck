import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import type { Media, Testimonial } from '@/payload-types'

const asMedia = (value: unknown): Media | null =>
  value && typeof value === 'object' ? (value as Media) : null

const asTestimonial = (value: unknown): Testimonial | null =>
  value && typeof value === 'object' ? (value as Testimonial) : null

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: await config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  const { docs } = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })

  const caseStudy = docs[0]

  if (!caseStudy) {
    notFound()
  }

  const cover = asMedia(caseStudy.coverImage)
  const testimonials = (caseStudy.testimonials || [])
    .map(asTestimonial)
    .filter((t): t is Testimonial => t !== null)

  return (
    <div style={{ background: '#fff', color: '#0b1120', minHeight: '100vh' }}>
      {user && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000, display: 'flex', gap: 8 }}>
          <a
            href="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: '#1e293b',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: 8,
              fontSize: '0.9rem',
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            className="admin-button"
          >
            Admin Panel
          </a>
          <a
            href={`/admin/collections/case-studies/${caseStudy.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: '#0b1120',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: 8,
              fontSize: '0.9rem',
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            className="edit-button"
          >
            Edit Case Study
          </a>
          <style>{`
            .admin-button:hover {
              background: #334155;
            }
            .edit-button:hover {
              background: #1e293b;
            }
          `}</style>
        </div>
      )}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
        <Link href="/case-studies" style={{ color: '#2563eb', textDecoration: 'none' }}>
          &larr; All case studies
        </Link>

        <h1 style={{ fontSize: '2.5rem', margin: '16px 0' }}>{caseStudy.title}</h1>

        {caseStudy.tags && caseStudy.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {caseStudy.tags.map((t) => (
              <span
                key={t.id || t.tag}
                style={{
                  fontSize: '0.8rem',
                  background: '#f1f5f9',
                  padding: '4px 10px',
                  borderRadius: 999,
                }}
              >
                {t.tag}
              </span>
            ))}
          </div>
        )}

        {cover?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.url}
            alt={cover.alt || caseStudy.title}
            style={{ width: '100%', borderRadius: 12, marginBottom: 24 }}
          />
        )}

        {caseStudy.summary && (
          <p style={{ fontSize: '1.15rem', lineHeight: 1.7 }}>{caseStudy.summary}</p>
        )}

        {testimonials.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 16 }}>Testimonials</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {testimonials.map((t) => {
                const avatar = asMedia(t.avatar)
                return (
                  <blockquote
                    key={t.id}
                    style={{
                      margin: 0,
                      padding: 20,
                      background: '#f8fafc',
                      borderLeft: '4px solid #2563eb',
                      borderRadius: 8,
                    }}
                  >
                    <p style={{ margin: '0 0 12px', fontStyle: 'italic' }}>&ldquo;{t.quote}&rdquo;</p>
                    <footer style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {avatar?.url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatar.url}
                          alt={avatar.alt || t.author}
                          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                        />
                      )}
                      <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                        <strong>{t.author}</strong>
                        {(t.role || t.company) && (
                          <>
                            {' — '}
                            {[t.role, t.company].filter(Boolean).join(', ')}
                          </>
                        )}
                      </span>
                    </footer>
                  </blockquote>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
