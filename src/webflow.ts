import {
  defaultProximaBaseUrls,
  defaultProximaFooterNavigation,
  defaultProximaNavigation,
  defaultProximaPolicyNavigation,
  proximaDestinationIsCurrent,
  resolveProximaHref,
} from './navigation.js'
import type {
  ProximaBaseUrls,
  ProximaDestination,
  ProximaNavigation,
  ProximaSite,
} from './types.js'

export type ProximaWebflowShellOptions = {
  currentPath: string
  currentSite: ProximaSite
  logoSrc: string
  footerLogoSrc: string
  designVersionLabel: string
  shellVersion: string
  navbarTarget?: string | HTMLElement
  footerTarget?: string | HTMLElement
  logoAlt?: string
  navigation?: ProximaNavigation
  footerNavigation?: ProximaDestination[]
  policyNavigation?: ProximaDestination[]
  baseUrls?: Partial<ProximaBaseUrls>
  basePath?: string
}

export type ProximaWebflowMount = {
  navbar: HTMLElement
  footer: HTMLElement
  destroy: () => void
}

const caretIcon = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="m3 6 5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
const menuIcon = '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>'
const closeIcon = '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>'

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function classNames(base: string, active: boolean) {
  return active ? `${base} is-active` : base
}

function renderLink(
  destination: ProximaDestination,
  options: ProximaWebflowShellOptions,
  className = '',
) {
  const urls = { ...defaultProximaBaseUrls, ...options.baseUrls }
  const active = proximaDestinationIsCurrent(
    destination,
    options.currentSite,
    options.currentPath,
  )
  const href = resolveProximaHref(
    destination,
    options.currentSite,
    urls,
    options.basePath,
  )
  const classes = classNames(className, active)
  return `<a${classes ? ` class="${escapeHtml(classes)}"` : ''} href="${escapeHtml(href)}"${active ? ' aria-current="page"' : ''}>${escapeHtml(destination.label)}</a>`
}

function renderDesktopGroup(
  group: ProximaNavigation['groups'][number],
  options: ProximaWebflowShellOptions,
) {
  const active = group.destinations.some((destination) =>
    proximaDestinationIsCurrent(destination, options.currentSite, options.currentPath),
  )
  const id = escapeHtml(group.id)
  return `<div class="proxima-shell-dropdown" data-proxima-shell-group="${id}">
    <button class="${classNames('proxima-shell-dropdown__trigger', active)}" type="button" aria-expanded="false" aria-controls="proxima-desktop-${id}-menu">
      <span>${escapeHtml(group.label)}</span>${caretIcon}
    </button>
    <div class="proxima-shell-dropdown__bridge" aria-hidden="true"></div>
    <div class="proxima-shell-dropdown__panel" id="proxima-desktop-${id}-menu" aria-hidden="true" inert>
      ${group.destinations.map((destination) => `<span>${renderLink(destination, options)}</span>`).join('')}
    </div>
  </div>`
}

function renderMobileGroup(
  group: ProximaNavigation['groups'][number],
  options: ProximaWebflowShellOptions,
) {
  const id = escapeHtml(group.id)
  return `<div class="proxima-shell-mobile-group">
    <button class="proxima-shell-mobile-group__trigger" type="button" aria-expanded="true" aria-controls="proxima-mobile-${id}-links">
      <span>${escapeHtml(group.label)}</span>${caretIcon}
    </button>
    <div class="proxima-shell-mobile-group__links" id="proxima-mobile-${id}-links" aria-hidden="false">
      <div class="proxima-shell-mobile-group__links-inner">
        ${group.destinations.map((destination) => `<span>${renderLink(destination, options)}</span>`).join('')}
      </div>
    </div>
  </div>`
}

export function renderProximaWebflowNavbar(options: ProximaWebflowShellOptions) {
  const navigation = options.navigation ?? defaultProximaNavigation
  const homeHref = resolveProximaHref(
    navigation.home,
    options.currentSite,
    { ...defaultProximaBaseUrls, ...options.baseUrls },
    options.basePath,
  )
  return `<header class="proxima-shell-navbar" data-proxima-shell-renderer="webflow" data-proxima-shell-version="${escapeHtml(options.shellVersion)}">
    <a href="${escapeHtml(homeHref)}" class="proxima-shell-navbar__brand" aria-label="Proxima SF home">
      <img src="${escapeHtml(options.logoSrc)}" width="2056" height="524" alt="${escapeHtml(options.logoAlt ?? '')}">
    </a>
    <button class="proxima-shell-navbar__menu" type="button" aria-expanded="false" aria-controls="proxima-mobile-menu" aria-label="Menu">
      <span data-proxima-shell-menu-icon>${menuIcon}</span>
    </button>
    <nav class="proxima-shell-desktop-nav" aria-label="Primary navigation">
      ${renderLink(navigation.home, options)}
      ${navigation.groups.map((group) => renderDesktopGroup(group, options)).join('')}
      ${renderLink(navigation.primaryAction, options, 'proxima-shell-primary-action')}
    </nav>
    <div class="proxima-shell-mobile-menu__scrim" aria-hidden="true" hidden></div>
    <dialog id="proxima-mobile-menu" class="proxima-shell-mobile-menu" aria-labelledby="proxima-mobile-menu-title">
      <div class="proxima-shell-mobile-menu__content">
        <h2 id="proxima-mobile-menu-title">Explore Proxima</h2>
        <nav class="proxima-shell-mobile-nav" aria-label="Mobile navigation">
          ${renderLink(navigation.home, options, 'proxima-shell-mobile-nav__link')}
          ${navigation.groups.map((group) => renderMobileGroup(group, options)).join('')}
          ${renderLink(navigation.primaryAction, options, 'proxima-shell-primary-action')}
        </nav>
      </div>
    </dialog>
  </header>`
}

function renderFooterLinks(
  destinations: ProximaDestination[],
  options: ProximaWebflowShellOptions,
) {
  return destinations
    .map((destination) => `<span>${renderLink(destination, options)}</span>`)
    .join('')
}

export function renderProximaWebflowFooter(options: ProximaWebflowShellOptions) {
  const home = options.navigation?.home ?? defaultProximaNavigation.home
  const homeHref = resolveProximaHref(
    home,
    options.currentSite,
    { ...defaultProximaBaseUrls, ...options.baseUrls },
    options.basePath,
  )
  return `<footer class="proxima-shell-footer" data-proxima-shell-renderer="webflow" data-proxima-shell-version="${escapeHtml(options.shellVersion)}">
    <div class="proxima-shell-footer__identity">
      <a href="${escapeHtml(homeHref)}" class="proxima-shell-footer__brand" aria-label="Proxima SF home">
        <img src="${escapeHtml(options.footerLogoSrc)}" width="4083" height="538" alt="${escapeHtml(options.logoAlt ?? '')}">
      </a>
      <p class="proxima-shell-footer__tagline">Coaching the Spiritually Curious</p>
      <address>1875 Mission St Ste 103 #425<br>San Francisco, CA 94103</address>
      <p>EIN 33-4450216</p>
      <small>© 2026 Proxima Partners · A San Francisco nonprofit · ${escapeHtml(options.designVersionLabel)}</small>
    </div>
    <a class="proxima-shell-footer__candid" aria-label="View Proxima Partners Inc on Candid" href="https://app.candid.org/profile/16402856/proxima-partners-inc-33-4450216/?pkId=e146c914-9d6d-4bf0-9f4f-5819149f17d5" target="_blank" rel="noreferrer">
      <img alt="Candid nonprofit transparency seal" src="https://widgets.guidestar.org/prod/v1/pdp/transparency-seal/16402856/svg" width="76" height="76" loading="lazy">
    </a>
    <nav class="proxima-shell-footer__links" aria-label="Footer navigation">
      ${renderFooterLinks(options.footerNavigation ?? defaultProximaFooterNavigation, options)}
    </nav>
    <nav class="proxima-shell-footer__policies" aria-label="Policies">
      ${renderFooterLinks(options.policyNavigation ?? defaultProximaPolicyNavigation, options)}
    </nav>
  </footer>`
}

function resolveTarget(target: string | HTMLElement | undefined, fallback: string) {
  const value = target ?? fallback
  const element = typeof value === 'string' ? document.querySelector<HTMLElement>(value) : value
  if (!element) throw new Error(`Proxima site shell target not found: ${String(value)}`)
  return element
}

function enhanceNavbar(navbar: HTMLElement) {
  const menuButton = navbar.querySelector<HTMLButtonElement>('.proxima-shell-navbar__menu')
  const menuIconTarget = navbar.querySelector<HTMLElement>('[data-proxima-shell-menu-icon]')
  const dialog = navbar.querySelector<HTMLDialogElement>('.proxima-shell-mobile-menu')
  const scrim = navbar.querySelector<HTMLElement>('.proxima-shell-mobile-menu__scrim')
  if (!menuButton || !menuIconTarget || !dialog || !scrim) {
    throw new Error('Proxima Webflow navbar markup is incomplete')
  }

  const cleanups: Array<() => void> = []
  let closeTimer = 0
  let open = false
  let previousBodyOverflow = ''
  let previousRootOverflow = ''

  const listen = <Target extends EventTarget>(
    target: Target,
    type: string,
    listener: EventListenerOrEventListenerObject,
  ) => {
    target.addEventListener(type, listener)
    cleanups.push(() => target.removeEventListener(type, listener))
  }

  const setDesktopGroup = (group: HTMLElement, expanded: boolean) => {
    group.classList.toggle('is-open', expanded)
    group.querySelector<HTMLButtonElement>('.proxima-shell-dropdown__trigger')
      ?.setAttribute('aria-expanded', String(expanded))
    const panel = group.querySelector<HTMLElement>('.proxima-shell-dropdown__panel')
    panel?.setAttribute('aria-hidden', String(!expanded))
    if (panel) panel.inert = !expanded
  }

  const closeDesktopGroups = (except?: HTMLElement) => {
    navbar.querySelectorAll<HTMLElement>('.proxima-shell-dropdown').forEach((group) => {
      if (group !== except) setDesktopGroup(group, false)
    })
  }

  navbar.querySelectorAll<HTMLElement>('.proxima-shell-dropdown').forEach((group) => {
    const trigger = group.querySelector<HTMLButtonElement>('.proxima-shell-dropdown__trigger')
    listen(group, 'pointerenter', () => {
      closeDesktopGroups(group)
      setDesktopGroup(group, true)
    })
    listen(group, 'pointerleave', () => setDesktopGroup(group, false))
    listen(group, 'focusout', (event) => {
      if (!group.contains((event as FocusEvent).relatedTarget as Node | null)) {
        setDesktopGroup(group, false)
      }
    })
    if (trigger) listen(trigger, 'click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true'
      closeDesktopGroups(group)
      setDesktopGroup(group, !expanded)
    })
  })

  const finishClose = () => {
    window.clearTimeout(closeTimer)
    open = false
    dialog.classList.remove('is-closing')
    scrim.classList.remove('is-closing')
    if (dialog.open) dialog.close()
    scrim.hidden = true
    menuButton.setAttribute('aria-expanded', 'false')
    menuButton.setAttribute('aria-label', 'Menu')
    menuIconTarget.innerHTML = menuIcon
    document.body.style.overflow = previousBodyOverflow
    document.documentElement.style.overflow = previousRootOverflow
    menuButton.focus()
  }

  const closeMobile = () => {
    if (!open) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishClose()
      return
    }
    dialog.classList.add('is-closing')
    scrim.classList.add('is-closing')
    closeTimer = window.setTimeout(finishClose, 520)
  }

  const openMobile = () => {
    if (open) return
    open = true
    previousBodyOverflow = document.body.style.overflow
    previousRootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    scrim.hidden = false
    dialog.show()
    menuButton.setAttribute('aria-expanded', 'true')
    menuButton.setAttribute('aria-label', 'Close menu')
    menuIconTarget.innerHTML = closeIcon
    dialog.querySelector<HTMLAnchorElement>('.proxima-shell-mobile-nav__link')?.focus()
  }

  listen(menuButton, 'click', () => open ? closeMobile() : openMobile())
  listen(scrim, 'pointerdown', closeMobile)
  listen(dialog, 'cancel', (event) => {
    event.preventDefault()
    closeMobile()
  })
  listen(dialog, 'keydown', (event) => {
    const keyboardEvent = event as KeyboardEvent
    if (keyboardEvent.key === 'Escape') {
      keyboardEvent.preventDefault()
      closeMobile()
      return
    }
    if (keyboardEvent.key !== 'Tab') return
    const controls = Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ))
    const first = controls[0]
    const last = controls.at(-1)
    if (!first || !last) return
    if (keyboardEvent.shiftKey && document.activeElement === first) {
      keyboardEvent.preventDefault()
      last.focus()
    } else if (!keyboardEvent.shiftKey && document.activeElement === last) {
      keyboardEvent.preventDefault()
      first.focus()
    }
  })
  navbar.querySelectorAll<HTMLButtonElement>('.proxima-shell-mobile-group__trigger')
    .forEach((trigger) => listen(trigger, 'click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true'
      trigger.setAttribute('aria-expanded', String(!expanded))
      const controls = trigger.getAttribute('aria-controls')
      const links = controls ? document.getElementById(controls) : null
      links?.setAttribute('aria-hidden', String(expanded))
      if (links) links.inert = expanded
    }))
  navbar.querySelectorAll<HTMLAnchorElement>('a').forEach((link) =>
    listen(link, 'click', () => {
      closeDesktopGroups()
      if (open) finishClose()
    }),
  )
  listen(document, 'pointerdown', (event) => {
    if (!navbar.contains(event.target as Node)) closeDesktopGroups()
  })
  listen(document, 'keydown', (event) => {
    if ((event as KeyboardEvent).key === 'Escape') closeDesktopGroups()
  })
  const desktop = window.matchMedia('(min-width: 801px)')
  const closeAtDesktop = () => {
    if (desktop.matches && open) finishClose()
  }
  desktop.addEventListener('change', closeAtDesktop)
  cleanups.push(() => desktop.removeEventListener('change', closeAtDesktop))

  return () => {
    window.clearTimeout(closeTimer)
    cleanups.forEach((cleanup) => cleanup())
    if (open) {
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousRootOverflow
    }
  }
}

export function mountProximaWebflowShell(
  options: ProximaWebflowShellOptions,
): ProximaWebflowMount {
  const navbarTarget = resolveTarget(options.navbarTarget, '[data-proxima-shell="navbar"]')
  const footerTarget = resolveTarget(options.footerTarget, '[data-proxima-shell="footer"]')
  navbarTarget.innerHTML = renderProximaWebflowNavbar(options)
  footerTarget.innerHTML = renderProximaWebflowFooter(options)
  const navbar = navbarTarget.firstElementChild
  const footer = footerTarget.firstElementChild
  if (!(navbar instanceof HTMLElement) || !(footer instanceof HTMLElement)) {
    throw new Error('Proxima Webflow shell failed to render')
  }
  const destroyNavbar = enhanceNavbar(navbar)
  return {
    navbar,
    footer,
    destroy: () => {
      destroyNavbar()
      navbarTarget.replaceChildren()
      footerTarget.replaceChildren()
    },
  }
}
