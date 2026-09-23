import { getPayload } from 'payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import config from '@/payload.config'
import type { Media } from '@/payload-types'

import styles from './SiteFooter.module.css'
import { FOOTER_DEFAULTS, telHref, type ChromeLink } from './siteChromeDefaults'

const mediaUrl = (media: (number | null) | Media | undefined): string | undefined => {
  if (!media || typeof media !== 'object') return undefined
  return media.url || (media.filename ? `/api/media/file/${media.filename}` : undefined)
}

const SOCIAL_ICONS: Record<string, { viewBox: string; path: string; color: string }> = {
  facebook: {
    viewBox: '0 0 512 512',
    path: 'M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z',
    color: '#3b5998',
  },
  instagram: {
    viewBox: '0 0 448 512',
    path: 'M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z',
    color: '#262626',
  },
  x: {
    viewBox: '0 0 512 512',
    path: 'M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z',
    color: '#000000',
  },
  linkedin: {
    viewBox: '0 0 448 512',
    path: 'M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z',
    color: '#0077b5',
  },
  youtube: {
    viewBox: '0 0 576 512',
    path: 'M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z',
    color: '#ff0000',
  },
}

export async function SiteFooter() {
  const payload = await getPayload({ config: await config })
  const footer = await payload.findGlobal({ slug: 'footer', depth: 1 })

  const logoSrc = mediaUrl(footer.logo) ?? '/revel-logo-white.png'
  const logoUrl = footer.logoUrl || FOOTER_DEFAULTS.logoUrl
  const address = footer.address || FOOTER_DEFAULTS.address
  const phone = footer.phone || FOOTER_DEFAULTS.phone
  const socialLinks = (footer.socialLinks?.length
    ? footer.socialLinks
    : FOOTER_DEFAULTS.socialLinks) as { platform: string; url: string }[]
  const communityLinks: ChromeLink[] = footer.communityLinks?.length
    ? footer.communityLinks.map((l) => ({ label: l.label, url: l.url }))
    : FOOTER_DEFAULTS.communityLinks
  const policyLinks: ChromeLink[] = footer.policyLinks?.length
    ? footer.policyLinks.map((l) => ({ label: l.label, url: l.url }))
    : FOOTER_DEFAULTS.policyLinks
  const privacyText = footer.privacyText || FOOTER_DEFAULTS.privacyText
  const privacyLinkLabel = footer.privacyLinkLabel || FOOTER_DEFAULTS.privacyLinkLabel
  const privacyLinkUrl = footer.privacyLinkUrl || FOOTER_DEFAULTS.privacyLinkUrl

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.col}>
          <a
            href={logoUrl}
            target="_blank"
            rel="noopener"
            className={styles.logoLink}
            aria-label="Revel Communities"
          >
            <img src={logoSrc} alt="Revel" width={300} height={43} className={styles.logo} />
          </a>
          <address className={styles.address} itemScope itemType="https://schema.org/PostalAddress">
            {address.split('\n').filter(Boolean).length > 0 && (
              <p>
                {address
                  .split('\n')
                  .filter(Boolean)
                  .map((line, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
              </p>
            )}
            {phone && (
              <p>
                <a href={telHref(phone)} className={styles.phone}>
                  {phone}
                </a>
              </p>
            )}
          </address>
        </div>

        {socialLinks.length > 0 && (
          <div className={styles.col}>
            <h4 className={styles.heading}>Follow Us</h4>
            <div className={styles.socialIcons} role="list">
              {socialLinks.map((link) => {
                const icon = SOCIAL_ICONS[link.platform]
                if (!icon) return null
                return (
                  <span role="listitem" key={link.platform}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener"
                      className={styles.socialIcon}
                      style={{ background: icon.color }}
                      aria-label={link.platform}
                    >
                      <svg aria-hidden="true" viewBox={icon.viewBox} xmlns="http://www.w3.org/2000/svg">
                        <path d={icon.path} />
                      </svg>
                    </a>
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {communityLinks.length > 0 && (
          <nav className={styles.col} aria-label="Communities">
            <ul className={styles.stateList}>
              {communityLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.url}
                    target={item.url.startsWith('http') ? '_blank' : undefined}
                    rel={item.url.startsWith('http') ? 'noopener' : undefined}
                    className={styles.stateLink}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className={styles.col}>
          <div className={styles.policyRow}>
            {policyLinks.length > 0 && (
              <ul className={styles.policyList}>
                {policyLinks.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.url}
                      target={item.url.startsWith('http') ? '_blank' : undefined}
                      rel={item.url.startsWith('http') ? 'noopener' : undefined}
                      className={styles.policyLink}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <img src="/equal-housing.svg" alt="Equal Housing" width={30} height={30} />
            <img src="/accessibility.svg" alt="Accessibility" width={23} height={30} />
          </div>
          <div className={styles.privacyChoices}>
            {privacyText && (
              <span className={styles.privacyText}>
                {privacyText}
                <img
                  src="/ccpa-opt-out-icon.png"
                  alt="CCPA icon"
                  width={32}
                  height={14}
                  className={styles.ccpaIcon}
                />
              </span>
            )}
            {privacyLinkLabel && privacyLinkUrl && (
              <a
                href={privacyLinkUrl}
                target="_blank"
                rel="noopener"
                className={styles.privacyLink}
              >
                {privacyLinkLabel}
              </a>
            )}
          </div>
        </div>
      </div>
      {footer.content ? (
        <div className={styles.extraContent}>
          <RichText data={footer.content} />
        </div>
      ) : null}
    </footer>
  )
}

export default SiteFooter
