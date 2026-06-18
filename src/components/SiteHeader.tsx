import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import type { Page } from '@/payload-types'

const resolveHref = (item: {
  type?: ('page' | 'custom') | null
  page?: (number | null) | Page
  url?: string | null
}): string => {
  if (item.type === 'page' && item.page && typeof item.page === 'object') {
    return `/${item.page.slug}`
  }
  return item.url || '#'
}

export async function SiteHeader() {
  const payload = await getPayload({ config: await config })
  const header = await payload.findGlobal({ slug: 'header', depth: 1 })
  const navItems = header.navItems || []

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid #e2e8f0',
        background: '#fff',
        color: '#0b1120',
      }}
    >
      <Link href="/" style={{ fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', color: 'inherit' }}>
        SNF
      </Link>
      <nav style={{ display: 'flex', gap: 20 }}>
        {navItems.map((item, i) => (
          <Link
            key={item.id || i}
            href={resolveHref(item)}
            style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.95rem' }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

export default SiteHeader
