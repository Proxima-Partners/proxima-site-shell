import type { MouseEvent, ReactNode } from 'react';
import type { ProximaApp, ProximaLink, ProximaNavigateHandler } from './types.js';
export type ShellLinkProps = {
    link: ProximaLink;
    currentApp: ProximaApp;
    className?: string;
    current?: boolean;
    ariaLabel?: string;
    onNavigate?: ProximaNavigateHandler;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
    children?: ReactNode;
};
export declare function ShellLink({ link, currentApp, className, current, ariaLabel, onNavigate, onClick, children }: ShellLinkProps): import("react").JSX.Element;
//# sourceMappingURL=ShellLink.d.ts.map