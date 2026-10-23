import { brandVersion, chrome } from './chrome.generated.js';
import type { ProximaApp, ProximaLink, ProximaResolvedLink } from './types.js';
export { brandVersion, chrome };
export declare const proximaApps: Record<ProximaApp, {
    basePath: string;
}>;
/** Root-relative on liveproxima.org for both apps, so moving between the main site and the cafe never changes the domain. */
export declare function resolveProximaLink(link: ProximaLink, currentApp: ProximaApp): ProximaResolvedLink;
/** currentPath is the path inside the current app, without its basePath (Next.js usePathname()). */
export declare function proximaLinkIsCurrent(link: ProximaLink, currentApp: ProximaApp, currentPath: string): boolean;
/** "© 2026 Proxima Partners, Inc." from the release's meta line. */
export declare const proximaFooterMeta: (year?: number) => string;
//# sourceMappingURL=navigation.d.ts.map