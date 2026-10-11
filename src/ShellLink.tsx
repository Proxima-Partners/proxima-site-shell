'use client'

import type { MouseEvent, ReactNode } from 'react'
import { resolveProximaLink } from './navigation.js'
import type { ProximaApp, ProximaLink, ProximaNavigateHandler } from './types.js'

export type ShellLinkProps = {
  link: ProximaLink
  currentApp: ProximaApp
  className?: string
  current?: boolean
  ariaLabel?: string
  onNavigate?: ProximaNavigateHandler
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
  children?: ReactNode
}

// One anchor for every header and footer link. External links open a new tab; everything else stays
// in the same tab on liveproxima.org. A consumer may route same-app links itself through onNavigate.
export function ShellLink({ link, currentApp, className, current, ariaLabel, onNavigate, onClick, children }: ShellLinkProps) {
  const resolved = resolveProximaLink(link, currentApp)
  const external = 'external' in link.href
  return (
    <a
      className={className}
      href={resolved.href}
      aria-current={current ? 'page' : undefined}
      aria-label={ariaLabel}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) onNavigate?.(event, resolved)
      }}
    >
      {children ?? link.label}
    </a>
  )
}
