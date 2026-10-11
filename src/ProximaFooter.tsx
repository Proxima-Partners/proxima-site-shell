'use client'

import { ShellLink } from './ShellLink.js'
import { brandVersion, chrome, proximaFooterMeta } from './navigation.js'
import { shellVersion } from './chrome.generated.js'
import type { ProximaApp, ProximaLink, ProximaNavigateHandler } from './types.js'

export type ProximaFooterProps = {
  currentApp: ProximaApp
  /** Base URL where the app serves its own copy of the footer badge images (the DAF badge path in the release is relative to it). Defaults to the app root. */
  assetBase?: string
  /** Optional site version label after the meta line, for example "v1.0". Nothing else is site-specific. */
  versionLabel?: string
  onNavigate?: ProximaNavigateHandler
}

// The footer for every page at liveproxima.org (Brand System 10-Site-Chrome): details, the DAF and Candid
// badges, the policy links and the meta line.
export function ProximaFooter({ currentApp, assetBase = '', versionLabel, onNavigate }: ProximaFooterProps) {
  const footer = chrome.footer
  const image = (src: string) => (/^https?:\/\//.test(src) ? src : `${assetBase}${src}`)
  return (
    <footer className="proxima-shell-footer" data-proxima-shell-version={shellVersion} data-proxima-brand-version={brandVersion}>
      <div className="proxima-shell-footer__inner">
        <div className="proxima-shell-footer__details">
          <p>{footer.details[0]}</p>
          <address>{footer.details[1]}</address>
          {footer.details.slice(2).map((line) => <p key={line}>{line}</p>)}
        </div>
        <div className="proxima-shell-footer__badges">
          {footer.badges.map((badge) => (
            <ShellLink key={badge.label} link={badge as ProximaLink} currentApp={currentApp} className="proxima-shell-footer__badge" ariaLabel={badge.label} onNavigate={onNavigate}>
              <img alt={badge.alt} src={image(badge.image)} width={76} height={76} loading="lazy" />
            </ShellLink>
          ))}
        </div>
        <nav className="proxima-shell-footer__policies" aria-label="Policies">
          {(footer.policies as readonly ProximaLink[]).map((link) => (
            <ShellLink key={link.label} link={link} currentApp={currentApp} onNavigate={onNavigate} />
          ))}
          {/* The quiet footer giving touchpoint (Brand System 2.2.1). */}
          <ShellLink link={footer.give as ProximaLink} currentApp={currentApp} className="proxima-shell-footer__give" onNavigate={onNavigate} />
        </nav>
        <p className="proxima-shell-footer__meta">
          {proximaFooterMeta()}
          {versionLabel ? <><span aria-hidden="true">|</span>{versionLabel}</> : null}
        </p>
      </div>
    </footer>
  )
}
