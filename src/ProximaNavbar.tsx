'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { defaultProximaBaseUrls, defaultProximaNavigation, proximaDestinationIsCurrent, resolveProximaHref } from './navigation.js'
import type { ProximaBaseUrls, ProximaDestination, ProximaNavigateHandler, ProximaNavigation, ProximaSite } from './types.js'

export type ProximaNavbarProps = {
  currentPath: string
  currentSite: ProximaSite
  logoSrc: string
  logoAlt?: string
  navigation?: ProximaNavigation
  onNavigate?: ProximaNavigateHandler
  baseUrls?: Partial<ProximaBaseUrls>
}

function CaretIcon() {
  return <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="m3 6 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function MenuIcon() {
  return <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
}

export function ProximaNavbar({
  currentPath,
  currentSite,
  logoSrc,
  logoAlt = '',
  navigation = defaultProximaNavigation,
  onNavigate,
  baseUrls,
}: ProximaNavbarProps) {
  const urls = { ...defaultProximaBaseUrls, ...baseUrls }
  const [mobileOpen, setMobileOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [desktopGroup, setDesktopGroup] = useState<string | null>(null)
  const [mobileGroups, setMobileGroups] = useState<Record<string, boolean>>(() => Object.fromEntries(navigation.groups.map((group) => [group.id, true])))
  const dialogRef = useRef<HTMLDialogElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const wasOpenRef = useRef(false)
  const closeTimerRef = useRef(0)
  const menuTransitionMs = 520

  const closeMobileMenu = useCallback(() => {
    if (!mobileOpen || closing) return
    const compactMenu = window.matchMedia('(max-width: 800px)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!compactMenu || reducedMotion) {
      window.clearTimeout(closeTimerRef.current)
      setClosing(false)
      setMobileOpen(false)
      return
    }
    setClosing(true)
    window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = window.setTimeout(() => {
      setMobileOpen(false)
      setClosing(false)
    }, menuTransitionMs)
  }, [closing, mobileOpen])

  const toggleMobileMenu = () => {
    if (closing) {
      window.clearTimeout(closeTimerRef.current)
      setClosing(false)
      setMobileOpen(true)
      return
    }
    if (mobileOpen) {
      closeMobileMenu()
      return
    }
    setMobileGroups(Object.fromEntries(navigation.groups.map((group) => [group.id, true])))
    setMobileOpen(true)
  }

  const follow = (event: React.MouseEvent<HTMLAnchorElement>, destination: ProximaDestination) => {
    setDesktopGroup(null)
    if (mobileOpen) {
      window.clearTimeout(closeTimerRef.current)
      setClosing(false)
      setMobileOpen(false)
    }
    onNavigate?.(event, destination)
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !mobileOpen) return
    const previousBodyOverflow = document.body.style.overflow
    const previousRootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    if (!dialog.open) dialog.show()
    dialog.querySelector<HTMLAnchorElement>('.proxima-shell-mobile-nav__link')?.focus()
    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousRootOverflow
      if (dialog.open) dialog.close()
    }
  }, [mobileOpen])

  useEffect(() => {
    if (wasOpenRef.current && !mobileOpen) menuButtonRef.current?.focus()
    wasOpenRef.current = mobileOpen
  }, [mobileOpen])

  useEffect(() => {
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setDesktopGroup(null)
    }
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setDesktopGroup(null)
    }
    document.addEventListener('pointerdown', closeOnOutsidePress)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress)
      document.removeEventListener('keydown', closeOnEscape)
      window.clearTimeout(closeTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 801px)')
    const closeAtDesktop = () => {
      if (!desktop.matches) return
      window.clearTimeout(closeTimerRef.current)
      setClosing(false)
      setMobileOpen(false)
    }
    desktop.addEventListener('change', closeAtDesktop)
    return () => desktop.removeEventListener('change', closeAtDesktop)
  }, [])

  const keepFocusInMenu = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeMobileMenu()
      return
    }
    if (event.key !== 'Tab') return
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
    const first = controls[0]
    const last = controls.at(-1)
    if (!first || !last) return
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const renderLink = (destination: ProximaDestination, className = '') => {
    const active = proximaDestinationIsCurrent(destination, currentSite, currentPath)
    return (
      <a
        className={`${className}${active ? ' is-active' : ''}`.trim()}
        href={resolveProximaHref(destination, currentSite, urls)}
        aria-current={active ? 'page' : undefined}
        onClick={(event) => follow(event, destination)}
      >
        {destination.label}
      </a>
    )
  }

  const desktopDropdown = (group: ProximaNavigation['groups'][number]) => {
    const expanded = desktopGroup === group.id
    const active = group.destinations.some((destination) => proximaDestinationIsCurrent(destination, currentSite, currentPath))
    return (
      <div
        className={`proxima-shell-dropdown${expanded ? ' is-open' : ''}`}
        onPointerEnter={() => setDesktopGroup(group.id)}
        onPointerLeave={() => setDesktopGroup(null)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDesktopGroup(null)
        }}
      >
        <button
          className={`proxima-shell-dropdown__trigger${active ? ' is-active' : ''}`}
          type="button"
          aria-expanded={expanded}
          aria-controls={`proxima-desktop-${group.id}-menu`}
          onClick={(event) => setDesktopGroup(event.detail === 0 && expanded ? null : group.id)}
        >
          <span>{group.label}</span>
          <CaretIcon />
        </button>
        <div className="proxima-shell-dropdown__bridge" aria-hidden="true" />
        <div className="proxima-shell-dropdown__panel" id={`proxima-desktop-${group.id}-menu`} aria-hidden={!expanded} inert={!expanded}>
          {group.destinations.map((destination) => <span key={`${destination.site}-${destination.path}-${destination.suffix ?? ''}`}>{renderLink(destination)}</span>)}
        </div>
      </div>
    )
  }

  const mobileGroup = (group: ProximaNavigation['groups'][number]) => {
    const expanded = mobileGroups[group.id] ?? false
    return (
      <div className="proxima-shell-mobile-group">
        <button
          className="proxima-shell-mobile-group__trigger"
          type="button"
          aria-expanded={expanded}
          aria-controls={`proxima-mobile-${group.id}-links`}
          onClick={() => setMobileGroups((current) => ({ ...current, [group.id]: !current[group.id] }))}
        >
          <span>{group.label}</span>
          <CaretIcon />
        </button>
        <div className="proxima-shell-mobile-group__links" id={`proxima-mobile-${group.id}-links`} aria-hidden={!expanded} inert={!expanded}>
          <div className="proxima-shell-mobile-group__links-inner">
            {group.destinations.map((destination) => <span key={`${destination.site}-${destination.path}-${destination.suffix ?? ''}`}>{renderLink(destination)}</span>)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <header className="proxima-shell-navbar" ref={headerRef}>
      <a
        href={resolveProximaHref(navigation.home, currentSite, urls)}
        className="proxima-shell-navbar__brand"
        aria-label="Proxima SF home"
        onClick={(event) => follow(event, navigation.home)}
      >
        <img src={logoSrc} width={2056} height={524} alt={logoAlt} />
      </a>
      <button
        ref={menuButtonRef}
        className="proxima-shell-navbar__menu"
        type="button"
        onClick={toggleMobileMenu}
        aria-expanded={mobileOpen && !closing}
        aria-controls="proxima-mobile-menu"
        aria-label={mobileOpen && !closing ? 'Close menu' : 'Menu'}
      >
        {mobileOpen && !closing ? <CloseIcon /> : <MenuIcon />}
      </button>
      <nav className="proxima-shell-desktop-nav" aria-label="Primary navigation">
        {renderLink(navigation.home)}
        {navigation.groups.map((group) => <span key={group.id}>{desktopDropdown(group)}</span>)}
        {renderLink(navigation.primaryAction, 'proxima-shell-primary-action')}
      </nav>
      {mobileOpen && <div className={`proxima-shell-mobile-menu__scrim${closing ? ' is-closing' : ''}`} aria-hidden="true" onPointerDown={closeMobileMenu} />}
      <dialog
        ref={dialogRef}
        id="proxima-mobile-menu"
        className={`proxima-shell-mobile-menu${closing ? ' is-closing' : ''}`}
        aria-labelledby="proxima-mobile-menu-title"
        aria-busy={closing || undefined}
        onKeyDown={keepFocusInMenu}
        onCancel={(event) => { event.preventDefault(); closeMobileMenu() }}
      >
        <div className="proxima-shell-mobile-menu__content">
          <h2 id="proxima-mobile-menu-title">Explore Proxima</h2>
          <nav className="proxima-shell-mobile-nav" aria-label="Mobile navigation">
            {renderLink(navigation.home, 'proxima-shell-mobile-nav__link')}
            {navigation.groups.map((group) => <span key={group.id}>{mobileGroup(group)}</span>)}
            {renderLink(navigation.primaryAction, 'proxima-shell-primary-action')}
          </nav>
        </div>
      </dialog>
    </header>
  )
}
