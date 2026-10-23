import type { ProximaApp, ProximaNavigateHandler } from './types.js';
export type ProximaFooterProps = {
    currentApp: ProximaApp;
    /** Base URL where the app serves its own copy of the footer badge images (the DAF badge path in the release is relative to it). Defaults to the app root. */
    assetBase?: string;
    /** Optional site version label after the meta line, for example "v1.0". Nothing else is site-specific. */
    versionLabel?: string;
    onNavigate?: ProximaNavigateHandler;
};
export declare function ProximaFooter({ currentApp, assetBase, versionLabel, onNavigate }: ProximaFooterProps): import("react").JSX.Element;
//# sourceMappingURL=ProximaFooter.d.ts.map