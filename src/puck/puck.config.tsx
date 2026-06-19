import React from 'react'
import type { Config, Data } from '@puckeditor/core'
import MediaField from './fields/MediaField'
import CarouselComponent from './components/Carousel'

export type HeroProps = {
  title: string
  subtitle?: string
  imageId?: string
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

export type CarouselSlide = {
  title: string
  description?: string
  imageId?: string
  imageUrl?: string
}

export type CarouselProps = {
  slides: CarouselSlide[]
}

export type BarItem = {
  label: string
  value: number
  color?: string
}

export type BarsProps = {
  title?: string
  items: BarItem[]
}

export type TableProps = {
  headers: string
  rows: { cells: string }[]
}

type Components = {
  Hero: HeroProps
  CTA: CTAProps
  RichText: RichTextProps
  Carousel: CarouselProps
  Bars: BarsProps
  Table: TableProps
}

export type PuckData = Data<Components>

export const puckConfig: Config<Components> = {
  components: {
    Hero: {
      label: 'Hero with Image',
      fields: {
        title: { type: 'text', label: 'Title' },
        subtitle: { type: 'richtext', label: 'Subtitle' },
        imageId: {
          type: 'custom',
          render: (props) => <MediaField {...props} />,
        },
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
        imageId: '',
        align: 'center',
      },
      render: ({ title, subtitle, imageId, align }) => (
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
            <div style={{ fontSize: '1.15rem', opacity: 0.8, margin: 0, maxWidth: 640 }}>
              {subtitle}
            </div>
          )}
          {imageId && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/api/media/${imageId}`}
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
        content: { type: 'richtext', label: 'Content' },
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
          }}
        >
          {content}
        </div>
      ),
    },
    Carousel: {
      label: 'Carousel',
      fields: {
        slides: {
          type: 'array',
          arrayFields: {
            title: { type: 'text', label: 'Title' },
            description: { type: 'richtext', label: 'Description' },
            imageId: {
              type: 'custom',
              render: (props) => <MediaField {...props} />,
            },
          },
          label: 'Slides',
        },
      },
      defaultProps: {
        slides: [
          { title: 'Slide 1', description: 'First slide description' },
          { title: 'Slide 2', description: 'Second slide description' },
          { title: 'Slide 3', description: 'Third slide description' },
        ],
      },
      render: ({ slides }) => <CarouselComponent slides={slides} />,
    },
    Bars: {
      label: 'Progress Bars',
      fields: {
        title: { type: 'text', label: 'Title' },
        items: {
          type: 'array',
          arrayFields: {
            label: { type: 'text', label: 'Label' },
            value: { type: 'number', label: 'Value (0-100)' },
            color: { type: 'text', label: 'Color (hex or name)' },
          },
          label: 'Bars',
        },
      },
      defaultProps: {
        title: 'Progress Overview',
        items: [
          { label: 'Item 1', value: 75, color: '#3b82f6' },
          { label: 'Item 2', value: 50, color: '#10b981' },
          { label: 'Item 3', value: 90, color: '#f59e0b' },
        ],
      },
      render: ({ title, items }) => (
        <section style={{ padding: '48px 24px', background: '#f8fafc' }}>
          {title && <h2 style={{ textAlign: 'center', marginBottom: 32 }}>{title}</h2>}
          <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {items.map((item, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 500 }}>{item.label}</span>
                  <span style={{ opacity: 0.7 }}>{item.value}%</span>
                </div>
                <div
                  style={{
                    height: 12,
                    background: '#e2e8f0',
                    borderRadius: 6,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(100, Math.max(0, item.value))}%`,
                      height: '100%',
                      background: item.color || '#3b82f6',
                      borderRadius: 6,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      ),
    },
    Table: {
      label: 'Table',
      fields: {
        headers: {
          type: 'textarea',
          label: 'Headers (comma-separated)',
        },
        rows: {
          type: 'array',
          arrayFields: {
            cells: { type: 'textarea', label: 'Row cells (comma-separated)' },
          },
          label: 'Rows',
        },
      },
      defaultProps: {
        headers: 'Column 1,Column 2,Column 3',
        rows: [
          { cells: 'Row 1, Cell 1,Row 1, Cell 2,Row 1, Cell 3' },
          { cells: 'Row 2, Cell 1,Row 2, Cell 2,Row 2, Cell 3' },
        ],
      },
      render: ({ headers, rows }) => {
        const headerArray = headers.split(',').map(h => h.trim())
        return (
          <section style={{ padding: '48px 24px' }}>
            <div style={{ maxWidth: 800, margin: '0 auto', overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  background: '#fff',
                  borderRadius: 8,
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    {headerArray.map((header, index) => (
                      <th
                        key={index}
                        style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontWeight: 600,
                          borderBottom: '2px solid #e2e8f0',
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row: any, rowIndex: number) => {
                    const cellArray = row.cells.split(',').map((c: string) => c.trim())
                    return (
                      <tr key={rowIndex} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        {cellArray.map((cell: string, cellIndex: number) => (
                          <td
                            key={cellIndex}
                            style={{
                              padding: '16px',
                              borderBottom: rowIndex === rows.length - 1 ? 'none' : '1px solid #e2e8f0',
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )
      },
    },
  },
}

export default puckConfig
