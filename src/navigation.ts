import type { ProximaBaseUrls, ProximaDestination, ProximaNavigation, ProximaSite } from './types.js'

export const defaultProximaBaseUrls: ProximaBaseUrls = {
  partners: 'https://liveproxima.org',
  cafe: 'https://proxima.cafe',
}

export const defaultProximaNavigation: ProximaNavigation = {
  home: { label: 'Home', path: '/', site: 'partners' },
  groups: [
    {
      id: 'stories',
      label: 'Stories',
      destinations: [
        { label: 'Impact', path: '/impact', site: 'partners' },
        { label: 'Blog', path: '/blog', site: 'cafe' },
        { label: 'Articles', path: '/articles', site: 'cafe' },
      ],
    },
    {
      id: 'about',
      label: 'About',
      destinations: [
        { label: 'Mission', path: '/about', site: 'partners', suffix: '#mission' },
        { label: 'Leadership', path: '/about', site: 'partners', suffix: '#meet-the-founders' },
        { label: 'Contact', path: '/contact', site: 'partners' },
      ],
    },
  ],
  primaryAction: { label: 'GIVE NOW', path: '/give', site: 'partners' },
}

export function resolveProximaHref(
  destination: ProximaDestination,
  currentSite: ProximaSite,
  baseUrls: ProximaBaseUrls = defaultProximaBaseUrls,
  currentSiteBasePath = '',
) {
  const base = destination.site === currentSite ? currentSiteBasePath : baseUrls[destination.site]
  return `${base}${destination.path}${destination.suffix ?? ''}`
}

export function proximaDestinationIsCurrent(
  destination: ProximaDestination,
  currentSite: ProximaSite,
  currentPath: string,
) {
  if (destination.site !== currentSite) return false
  if (destination.path === '/') return currentPath === '/'
  return currentPath === destination.path || currentPath.startsWith(`${destination.path}/`)
}
