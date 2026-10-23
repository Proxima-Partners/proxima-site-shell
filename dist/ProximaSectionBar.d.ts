import { chrome } from './navigation.js';
import type { ProximaApp, ProximaNavigateHandler } from './types.js';
export type ProximaSectionBarProps = {
    /** The section bar to show; the release defines one for the cafe. */
    section: keyof typeof chrome.sectionBars;
    currentApp: ProximaApp;
    currentPath: string;
    onNavigate?: ProximaNavigateHandler;
};
export declare function ProximaSectionBar({ section, currentApp, currentPath, onNavigate }: ProximaSectionBarProps): import("react").JSX.Element;
//# sourceMappingURL=ProximaSectionBar.d.ts.map