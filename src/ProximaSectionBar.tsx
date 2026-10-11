'use client'

import { ShellLink } from './ShellLink.js'
import { chrome, proximaLinkIsCurrent } from './navigation.js'
import type { ProximaApp, ProximaLink, ProximaNavigateHandler } from './types.js'

export type ProximaSectionBarProps = {
  /** The section bar to show; the release defines one for the cafe. */
  section: keyof typeof chrome.sectionBars
  currentApp: ProximaApp
  currentPath: string
  onNavigate?: ProximaNavigateHandler
}

// The section bar under the header (Brand System 10-Site-Chrome). The cafe is named here only, never in
// the header or footer.
export function ProximaSectionBar({ section, currentApp, currentPath, onNavigate }: ProximaSectionBarProps) {
  const bar = chrome.sectionBars[section]
  return (
    <nav className="proxima-shell-section-bar" aria-label={bar.label}>
      <div className="proxima-shell-section-bar__inner">
        {(bar.items as readonly ProximaLink[]).map((link) => (
          <ShellLink
            key={link.label}
            link={link}
            currentApp={currentApp}
            current={proximaLinkIsCurrent(link, currentApp, currentPath)}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </nav>
  )
}
