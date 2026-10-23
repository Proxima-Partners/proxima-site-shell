import type { ProximaApp, ProximaNavigateHandler } from './types.js';
export type ProximaGiveMenuProps = {
    currentApp: ProximaApp;
    /** "nav" is the header button; "prompt" is a gift touchpoint lower on a page. */
    variant?: 'nav' | 'prompt';
    /** Defaults to the release's button label ("Give"). */
    label?: string;
    onNavigate?: ProximaNavigateHandler;
};
export declare function ProximaGiveMenu({ currentApp, variant, label, onNavigate }: ProximaGiveMenuProps): import("react").JSX.Element;
//# sourceMappingURL=ProximaGiveMenu.d.ts.map