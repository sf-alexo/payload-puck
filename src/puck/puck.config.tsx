import React from 'react'
import type { Config } from '@puckeditor/core'

export type HeroProps = {
  title: string
  subtitle?: string
  imageUrl?: string
  align: 'left' | 'center'
}

export type CTAProps = {
  heading: string
  buttonLabel: string
  buttonHref: string
}

export type RichTextProps = {
  content: string
}

type Components = {
  Hero: HeroProps
  CTA: CTAProps
  RichText: RichTextProps
}

export const puckConfig: Config<Components> = {
  components: {
    Hero: {
      label: 'Hero with Image',
      fields: {
        title: { type: 'text', label: 'Title' },
        subtitle: { type: 'textarea', label: 'Subtitle' },
        imageUrl: { type: 'text', label: 'Image URL' },
        align: {
          type: 'radio',
          label: 'Alignment',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
          ],
        },
      },
      defaultProps: {
        title: 'Your headline here',
        subtitle: 'A short supporting sentence that explains the value.',
        imageUrl: '',
        align: 'center',
      },
      render: ({ title, subtitle, imageUrl, align }) => (
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: align === 'center' ? 'center' : 'flex-start',
            textAlign: align === 'center' ? 'center' : 'left',
            gap: 16,
            padding: '64px 24px',
            background: '#0b1120',
            color: '#fff',
          }}
        >
          <h1 style={{ fontSize: '2.5rem', margin: 0, maxWidth: 760 }}>{title}</h1>
          {subtitle && (
            <p style={{ fontSize: '1.15rem', opacity: 0.8, margin: 0, maxWidth: 640 }}>
              {subtitle}
            </p>
          )}
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={title}
              style={{ maxWidth: '100%', borderRadius: 12, marginTop: 16 }}
            />
          )}
        </section>
      ),
    },
    CTA: {
      label: 'CTA Section',
      fields: {
        heading: { type: 'text', label: 'Heading' },
        buttonLabel: { type: 'text', label: 'Button Label' },
        buttonHref: { type: 'text', label: 'Button URL' },
      },
      defaultProps: {
        heading: 'Ready to get started?',
        buttonLabel: 'Get in touch',
        buttonHref: '#',
      },
      render: ({ heading, buttonLabel, buttonHref }) => (
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            padding: '56px 24px',
            background: '#f1f5f9',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '1.75rem', margin: 0 }}>{heading}</h2>
          <a
            href={buttonHref}
            style={{
              background: '#2563eb',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            {buttonLabel}
          </a>
        </section>
      ),
    },
    RichText: {
      label: 'Rich Text',
      fields: {
        content: { type: 'textarea', label: 'Content' },
      },
      defaultProps: {
        content: 'Write your paragraph content here.',
      },
      render: ({ content }) => (
        <div
          style={{
            maxWidth: 760,
            margin: '0 auto',
            padding: '32px 24px',
            fontSize: '1.05rem',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
          }}
        >
          {content}
        </div>
      ),
    },
  },
}

export default puckConfig
