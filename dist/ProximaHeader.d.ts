import type { ProximaApp, ProximaNavigateHandler } from './types.js';
export type ProximaHeaderProps = {
    /** Which app renders the header: the main site, or the cafe at /cafe. */
    currentApp: ProximaApp;
    /** Path inside the current app, without its basePath (Next.js usePathname()). */
    currentPath: string;
    /** URL of the Proxima San Francisco lockup as the app serves it (from its brand mirror). */
    logoSrc: string;
    onNavigate?: ProximaNavigateHandler;
};
export declare function ProximaHeader({ currentApp, currentPath, logoSrc, onNavigate }: ProximaHeaderProps): import("react").JSX.Element;
//# sourceMappingURL=ProximaHeader.d.ts.map