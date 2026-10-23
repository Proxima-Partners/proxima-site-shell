'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { resolveProximaLink } from './navigation.js';
// One anchor for every header and footer link. External links open a new tab; everything else stays
// in the same tab on liveproxima.org. A consumer may route same-app links itself through onNavigate.
export function ShellLink({ link, currentApp, className, current, ariaLabel, onNavigate, onClick, children }) {
    const resolved = resolveProximaLink(link, currentApp);
    const external = 'external' in link.href;
    return (_jsx("a", { className: className, href: resolved.href, "aria-current": current ? 'page' : undefined, "aria-label": ariaLabel, ...(external ? { target: '_blank', rel: 'noreferrer' } : {}), onClick: (event) => {
            onClick?.(event);
            if (!event.defaultPrevented)
                onNavigate?.(event, resolved);
        }, children: children ?? link.label }));
}
