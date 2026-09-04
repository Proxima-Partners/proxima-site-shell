'use client'

import type { ProximaBaseUrls, ProximaDestination, ProximaNavigateHandler, ProximaSite } from './types.js'
import { defaultProximaBaseUrls, resolveProximaHref } from './navigation.js'

export type ProximaFooterProps = {
  currentSite: ProximaSite
  designVersionLabel: string
  logoSrc: string
  logoAlt?: string
  navigation?: ProximaDestination[]
  policyNavigation?: ProximaDestination[]
  onNavigate?: ProximaNavigateHandler
  baseUrls?: Partial<ProximaBaseUrls>
}

const footerNavigation: ProximaDestination[] = [
  { label: 'Contact', path: '/contact', site: 'partners', suffix: '#contact-form' },
  { label: 'Leadership', path: '/about', site: 'partners', suffix: '#meet-the-founders' },
  { label: 'Donation', path: '/give', site: 'partners' },
]

const footerPolicies: ProximaDestination[] = [
  { label: 'Privacy Policy', path: '/privacy-policy', site: 'partners' },
  { label: 'Messaging Policy', path: '/messaging-policy', site: 'partners' },
]

export function ProximaFooter({
  currentSite,
  designVersionLabel,
  logoSrc,
  logoAlt = '',
  navigation = footerNavigation,
  policyNavigation = footerPolicies,
  onNavigate,
  baseUrls,
}: ProximaFooterProps) {
  const urls = { ...defaultProximaBaseUrls, ...baseUrls }
  const home: ProximaDestination = { label: 'Home', path: '/', site: 'partners' }
  const link = (destination: ProximaDestination) => (
    <a
      href={resolveProximaHref(destination, currentSite, urls)}
      onClick={(event) => onNavigate?.(event, destination)}
    >
      {destination.label}
    </a>
  )

  return (
    <footer className="proxima-shell-footer">
      <div className="proxima-shell-footer__identity">
        <a
          href={resolveProximaHref(home, currentSite, urls)}
          className="proxima-shell-footer__brand"
          aria-label="Proxima SF home"
          onClick={(event) => onNavigate?.(event, home)}
        >
          <img src={logoSrc} width={4083} height={538} alt={logoAlt} />
        </a>
        <p className="proxima-shell-footer__tagline">Coaching the Spiritually Curious</p>
        <address>1875 Mission St Ste 103 #425<br />San Francisco, CA 94103</address>
        <p>EIN 33-4450216</p>
        <small>© 2026 Proxima Partners · A San Francisco nonprofit · {designVersionLabel}</small>
      </div>
      <a
        className="proxima-shell-footer__candid"
        aria-label="View Proxima Partners Inc on Candid"
        href="https://app.candid.org/profile/16402856/proxima-partners-inc-33-4450216/?pkId=e146c914-9d6d-4bf0-9f4f-5819149f17d5"
        target="_blank"
        rel="noreferrer"
      >
        <img
          alt="Candid nonprofit transparency seal"
          src="https://widgets.guidestar.org/prod/v1/pdp/transparency-seal/16402856/svg"
          width="76"
          height="76"
          loading="lazy"
        />
      </a>
      <nav className="proxima-shell-footer__links" aria-label="Footer navigation">
        {navigation.map((destination) => <span key={`${destination.site}-${destination.path}-${destination.suffix ?? ''}`}>{link(destination)}</span>)}
      </nav>
      <nav className="proxima-shell-footer__policies" aria-label="Policies">
        {policyNavigation.map((destination) => <span key={`${destination.site}-${destination.path}-${destination.suffix ?? ''}`}>{link(destination)}</span>)}
      </nav>
    </footer>
  )
}
