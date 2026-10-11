'use client'

import { useState } from 'react'
import type { MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { ProximaGiveMenu } from './ProximaGiveMenu.js'
import { ShellLink } from './ShellLink.js'
import { brandVersion, chrome, proximaLinkIsCurrent } from './navigation.js'
import { shellVersion } from './chrome.generated.js'
import type { ProximaApp, ProximaLink, ProximaNavigateHandler } from './types.js'

export type ProximaHeaderProps = {
  /** Which app renders the header: the main site, or the cafe at /cafe. */
  currentApp: ProximaApp
  /** Path inside the current app, without its basePath (Next.js usePathname()). */
  currentPath: string
  /** URL of the Proxima San Francisco lockup as the app serves it (from its brand mirror). */
  logoSrc: string
  onNavigate?: ProximaNavigateHandler
}

// The header for every page at liveproxima.org (Brand System 10-Site-Chrome, FB-022): the lockup,
// Who We Are, Stories, and the Give menu, with a menu button on phones.
export function ProximaHeader({ currentApp, currentPath, logoSrc, onNavigate }: ProximaHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const header = chrome.header
  const links = header.nav as readonly ProximaLink[]

  // A same-page section link (for example /#about while on /) whose hash is already in the address does
  // not scroll again on a second click. Handle that case only; leave every other click to the browser or
  // the app's router. The menu closes first so the scroll is measured without it.
  const jumpToSection = (event: MouseEvent<HTMLAnchorElement>, link: ProximaLink) => {
    flushSync(() => setMenuOpen(false))
    const h = link.href
    if (!('app' in h) || h.app !== currentApp || !h.path.includes('#')) return
    const [path, hash] = h.path.split('#')
    if ((path || '/') !== currentPath || window.location.hash !== `#${hash}`) return
    const target = document.getElementById(hash)
    if (!target) return
    event.preventDefault()
    target.scrollIntoView()
  }

  const navLink = (link: ProximaLink) => (
    <ShellLink
      key={link.label}
      link={link}
      currentApp={currentApp}
      current={proximaLinkIsCurrent(link, currentApp, currentPath)}
      onNavigate={onNavigate}
      onClick={(event) => jumpToSection(event, link)}
    />
  )

  return (
    <>
      <a className="proxima-shell-skip" href={header.skipLink.target}>{header.skipLink.label}</a>
      <header className="proxima-shell-header" data-proxima-shell-version={shellVersion} data-proxima-brand-version={brandVersion}>
        <div className="proxima-shell-header__inner">
          <ShellLink link={{ label: header.logo.label, href: header.logo.href }} currentApp={currentApp} className="proxima-shell-header__logo" ariaLabel={header.logo.label} onNavigate={onNavigate}>
            <img src={logoSrc} width={560} height={143} alt={header.logo.alt} />
          </ShellLink>
          <nav className="proxima-shell-header__nav" aria-label="Primary navigation">{links.map(navLink)}</nav>
          <div className="proxima-shell-header__actions">
            <ProximaGiveMenu currentApp={currentApp} onNavigate={onNavigate} />
            <button
              className="proxima-shell-header__menu"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="proxima-shell-mobile-nav"
              aria-label={menuOpen ? header.mobileMenu.closeLabel : header.mobileMenu.openLabel}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="proxima-shell-header__burger" aria-hidden="true" />
            </button>
          </div>
        </div>
        <nav className="proxima-shell-header__mobile" id="proxima-shell-mobile-nav" aria-label="Mobile navigation" hidden={!menuOpen}>
          {links.map(navLink)}
        </nav>
      </header>
    </>
  )
}
