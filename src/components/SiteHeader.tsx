import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import type { Header, Media, Page } from '@/payload-types'

import { HEADER_DEFAULTS, type ChromeNavItem } from './siteChromeDefaults'
import { SiteHeaderView, type HeaderViewData } from './SiteHeaderView'

type LinkField = {
  type?: ('page' | 'custom') | null
  label?: string | null
  page?: (number | null) | Page
  url?: string | null
}

const resolveHref = (item: LinkField): string => {
  if (item.type === 'page' && item.page && typeof item.page === 'object') {
    return `/${item.page.slug}`
  }
  return item.url || '#'
}

const mediaUrl = (media: (number | null) | Media | undefined): string | undefined => {
  if (!media || typeof media !== 'object') return undefined
  return media.url || (media.filename ? `/api/media/file/${media.filename}` : undefined)
}

const toNavItem = (item: NonNullable<Header['navItems']>[number]): ChromeNavItem => ({
  label: item.label,
  url: resolveHref(item),
  children: (item.children ?? [])
    .filter((child) => child.label)
    .map((child) => ({ label: child.label!, url: resolveHref(child) })),
})

export async function SiteHeader() {
  const payload = await getPayload({ config: await config })
  const header = await payload.findGlobal({ slug: 'header', depth: 1 })

  const navItems = (header.navItems ?? [])
    .filter((item) => item.label)
    .map(toNavItem)

  const data: HeaderViewData = {
    logoSrc: mediaUrl(header.logo) ?? '/revel-eagle-logo-white.png',
    logoSolidSrc: mediaUrl(header.logoSolid) ?? '/revel-eagle-logo.png',
    navItems: navItems.length > 0 ? navItems : HEADER_DEFAULTS.navItems,
    phone: header.phone || HEADER_DEFAULTS.phone,
    ctaLabel: header.ctaLabel || HEADER_DEFAULTS.ctaLabel,
    ctaUrl: header.ctaUrl || HEADER_DEFAULTS.ctaUrl,
    mobileNavItems: (header.mobileNavItems ?? [])
      .filter((item) => item.label)
      .map((item) => ({ label: item.label!, url: resolveHref(item) })),
  }

  if (data.mobileNavItems.length === 0) {
    data.mobileNavItems = HEADER_DEFAULTS.mobileNavItems
  }

  return <SiteHeaderView data={data} />
}

export default SiteHeader
