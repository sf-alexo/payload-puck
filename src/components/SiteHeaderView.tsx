'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import styles from './SiteHeader.module.css'
import { telHref, type ChromeLink, type ChromeNavItem } from './siteChromeDefaults'

// Pages whose first section is a dark hero that the transparent header overlays.
const OVERLAY_PATHS = new Set(['/revel-eagle'])

export type HeaderViewData = {
  logoSrc: string
  logoSolidSrc: string
  navItems: ChromeNavItem[]
  phone?: string
  ctaLabel?: string
  ctaUrl?: string
  mobileNavItems: ChromeLink[]
}

const isExternal = (href: string) => href.startsWith('http')

function NavLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string
  className?: string
  children: React.ReactNode
  onClick?: () => void
}) {
  if (isExternal(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener" onClick={onClick}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}

const ChevronDown = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 448 512"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.chevron}
  >
    <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
  </svg>
)

export function SiteHeaderView({ data }: { data: HeaderViewData }) {
  const pathname = usePathname()
  const overlay = OVERLAY_PATHS.has(pathname)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [prevPathname, setPrevPathname] = useState(pathname)

  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solid = !overlay || scrolled || menuOpen
  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className={`${styles.header} ${solid ? styles.solid : ''}`}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logoLink} aria-label="Revel Eagle">
            <img
              src={data.logoSrc}
              alt="Revel Eagle"
              className={`${styles.logo} ${styles.logoWhite}`}
              width={700}
              height={179}
            />
            <img
              src={data.logoSolidSrc}
              alt="Revel Eagle"
              className={`${styles.logo} ${styles.logoColor}`}
              width={700}
              height={179}
            />
          </Link>

          <nav className={styles.nav} aria-label="Menu">
            <ul className={styles.navList}>
              {data.navItems.map((item) =>
                item.children && item.children.length > 0 ? (
                  <li key={item.label} className={styles.hasSubmenu}>
                    <button type="button" className={styles.navLink} aria-haspopup="true">
                      {item.label}
                      <ChevronDown />
                    </button>
                    <ul className={styles.submenu}>
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <NavLink href={child.url} className={styles.submenuLink}>
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={item.label}>
                    <NavLink href={item.url} className={styles.navLink}>
                      {item.label}
                    </NavLink>
                  </li>
                ),
              )}
              {data.phone && (
                <li>
                  <a href={telHref(data.phone)} className={styles.navLink}>
                    {data.phone}
                  </a>
                </li>
              )}
              {data.ctaLabel && data.ctaUrl && (
                <li>
                  <NavLink href={data.ctaUrl} className={styles.ctaLink}>
                    {data.ctaLabel}
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>

          <button
            type="button"
            className={styles.burger}
            aria-label="Menu Toggle"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <svg aria-hidden="true" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                <path d="M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                <path d="M104 333H896C929 333 958 304 958 271S929 208 896 208H104C71 208 42 237 42 271S71 333 104 333ZM104 583H896C929 583 958 554 958 521S929 458 896 458H104C71 458 42 487 42 521S71 583 104 583ZM104 833H896C929 833 958 804 958 771S929 708 896 708H104C71 708 42 737 42 771S71 833 104 833Z" />
              </svg>
            )}
          </button>
        </div>

        <nav
          className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ''}`}
          aria-label="Menu"
          aria-hidden={!menuOpen}
        >
          <ul className={styles.mobileNavList}>
            {data.navItems.map((item) =>
              item.children && item.children.length > 0 ? (
                <React.Fragment key={item.label}>
                  <li className={styles.mobileGroup}>{item.label}</li>
                  {item.children.map((child) => (
                    <li key={child.label} className={styles.mobileSubItem}>
                      <NavLink
                        href={child.url}
                        className={styles.mobileNavLink}
                        onClick={closeMenu}
                      >
                        {child.label}
                      </NavLink>
                    </li>
                  ))}
                </React.Fragment>
              ) : (
                <li key={item.label}>
                  <NavLink href={item.url} className={styles.mobileNavLink} onClick={closeMenu}>
                    {item.label}
                  </NavLink>
                </li>
              ),
            )}
            {data.phone && (
              <li>
                <a href={telHref(data.phone)} className={styles.mobileNavLink}>
                  {data.phone}
                </a>
              </li>
            )}
            {data.mobileNavItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  href={item.url}
                  className={styles.mobileNavLink}
                  onClick={closeMenu}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            {data.ctaLabel && data.ctaUrl && (
              <li>
                <NavLink
                  href={data.ctaUrl}
                  className={styles.mobileCtaLink}
                  onClick={closeMenu}
                >
                  {data.ctaLabel}
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </header>
      {!overlay && <div className={styles.spacer} aria-hidden="true" />}
    </>
  )
}

export default SiteHeaderView
