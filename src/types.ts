import type { MouseEvent as ReactMouseEvent } from 'react'

/** The two applications served at liveproxima.org: the main site, and the cafe at its basePath (/cafe). */
export type ProximaApp = 'main' | 'cafe'

/** A link target from the Brand System's 10-Site-Chrome/navigation.json. */
export type ProximaHref =
  | { app: ProximaApp; path: string }
  | { external: string }
  | { fundraiseUpForm: string }

export type ProximaLink = {
  label: string
  description?: string
  href: ProximaHref
}

/** What a click resolves to, passed to onNavigate so a consumer can route same-app links client-side. */
export type ProximaResolvedLink = {
  link: ProximaLink
  href: string
  /** True when the link stays inside the app that rendered it (safe for the app's own router). */
  sameApp: boolean
  /** For same-app links: the path inside the app, without its basePath (what a Next.js Link expects). */
  appPath?: string
}

export type ProximaNavigateHandler = (
  event: ReactMouseEvent<HTMLAnchorElement>,
  resolved: ProximaResolvedLink,
) => void
