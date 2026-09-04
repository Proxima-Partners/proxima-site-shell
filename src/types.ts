import type { MouseEvent as ReactMouseEvent } from 'react'

export type ProximaSite = 'partners' | 'cafe'

export type ProximaDestination = {
  label: string
  path: string
  site: ProximaSite
  suffix?: string
}

export type ProximaNavigationGroup = {
  id: string
  label: string
  destinations: ProximaDestination[]
}

export type ProximaNavigation = {
  home: ProximaDestination
  groups: ProximaNavigationGroup[]
  primaryAction: ProximaDestination
}

export type ProximaNavigateHandler = (
  event: ReactMouseEvent<HTMLAnchorElement>,
  destination: ProximaDestination,
) => void

export type ProximaBaseUrls = Record<ProximaSite, string>
