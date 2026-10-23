import { brandVersion, chrome } from './chrome.generated.js';
// The header and footer come only from the Brand System release mirrored in ./brand
// (10-Site-Chrome/navigation.json). Nothing here is typed by hand.
export { brandVersion, chrome };
export const proximaApps = chrome.apps;
const appUrl = (app, path) => {
    const base = proximaApps[app].basePath;
    return base && path === '/' ? base : `${base}${path}`;
};
/** Root-relative on liveproxima.org for both apps, so moving between the main site and the cafe never changes the domain. */
export function resolveProximaLink(link, currentApp) {
    const h = link.href;
    if ('external' in h)
        return { link, href: h.external, sameApp: false };
    if ('fundraiseUpForm' in h)
        return { link, href: `?form=${h.fundraiseUpForm}`, sameApp: false };
    const href = appUrl(h.app, h.path);
    return h.app === currentApp ? { link, href, sameApp: true, appPath: h.path } : { link, href, sameApp: false };
}
/** currentPath is the path inside the current app, without its basePath (Next.js usePathname()). */
export function proximaLinkIsCurrent(link, currentApp, currentPath) {
    const h = link.href;
    if (!('app' in h) || h.path.includes('#'))
        return false;
    if (h.app !== currentApp)
        return false;
    if (h.path === '/')
        return currentPath === '/';
    return currentPath === h.path || currentPath.startsWith(`${h.path}/`);
}
/** "© 2026 Proxima Partners, Inc." from the release's meta line. */
export const proximaFooterMeta = (year = new Date().getFullYear()) => chrome.footer.meta.replace('{year}', String(year));
