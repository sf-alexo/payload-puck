import { getPayload } from 'payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import config from '@/payload.config'

export async function SiteFooter() {
  const payload = await getPayload({ config: await config })
  const footer = await payload.findGlobal({ slug: 'footer', depth: 1 })

  return (
    <footer
      style={{
        borderTop: '1px solid #e2e8f0',
        background: '#f8fafc',
        color: '#0b1120',
        padding: '32px 24px',
      }}
    >
      <div style={{ maxWidth: 1040, margin: '0 auto', fontSize: '0.9rem' }}>
        {footer.content ? (
          <RichText data={footer.content} />
        ) : (
          <p style={{ opacity: 0.6, margin: 0 }}>
            Set footer content in the{' '}
            <a href="/admin/globals/footer">admin panel</a>.
          </p>
        )}
      </div>
    </footer>
  )
}

export default SiteFooter
