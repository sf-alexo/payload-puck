import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import type { Industry, Media, ProjectType, Techstack, Testimonial } from '@/payload-types'

const asMedia = (value: unknown): Media | null =>
  value && typeof value === 'object' ? (value as Media) : null

const asTestimonial = (value: unknown): Testimonial | null =>
  value && typeof value === 'object' ? (value as Testimonial) : null

const asProjectType = (value: unknown): ProjectType | null =>
  value && typeof value === 'object' ? (value as ProjectType) : null

const asIndustry = (value: unknown): Industry | null =>
  value && typeof value === 'object' ? (value as Industry) : null

const asTechstack = (value: unknown): Techstack | null =>
  value && typeof value === 'object' ? (value as Techstack) : null

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
  const projectTypes = (caseStudy.projectTypes || [])
    .map(asProjectType)
    .filter((pt): pt is ProjectType => pt !== null)
  const industries = (caseStudy.industries || [])
    .map(asIndustry)
    .filter((ind): ind is Industry => ind !== null)
  const techstacks = (caseStudy.techstacks || [])
    .map(asTechstack)
    .filter((ts): ts is Techstack => ts !== null)

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

        {(projectTypes.length || industries.length || techstacks.length) && (
          <div style={{ marginBottom: 24 }}>
            {projectTypes.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project Types</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  {projectTypes.map((pt) => (
                    <span
                      key={pt.id}
                      style={{
                        fontSize: '0.8rem',
                        background: '#dbeafe',
                        color: '#1e40af',
                        padding: '4px 10px',
                        borderRadius: 999,
                      }}
                    >
                      {pt.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {industries.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Industries</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  {industries.map((ind) => (
                    <span
                      key={ind.id}
                      style={{
                        fontSize: '0.8rem',
                        background: '#dcfce7',
                        color: '#166534',
                        padding: '4px 10px',
                        borderRadius: 999,
                      }}
                    >
                      {ind.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {techstacks.length > 0 && (
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tech Stack</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  {techstacks.map((ts) => (
                    <span
                      key={ts.id}
                      style={{
                        fontSize: '0.8rem',
                        background: '#f1f5f9',
                        color: '#475569',
                        padding: '4px 10px',
                        borderRadius: 999,
                      }}
                    >
                      {ts.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
