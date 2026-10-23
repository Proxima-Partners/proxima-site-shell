'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { ShellLink } from './ShellLink.js';
import { chrome, proximaLinkIsCurrent } from './navigation.js';
// The section bar under the header (Brand System 10-Site-Chrome). The cafe is named here only, never in
// the header or footer.
export function ProximaSectionBar({ section, currentApp, currentPath, onNavigate }) {
    const bar = chrome.sectionBars[section];
    return (_jsx("nav", { className: "proxima-shell-section-bar", "aria-label": bar.label, children: _jsx("div", { className: "proxima-shell-section-bar__inner", children: bar.items.map((link) => (_jsx(ShellLink, { link: link, currentApp: currentApp, current: proximaLinkIsCurrent(link, currentApp, currentPath), onNavigate: onNavigate }, link.label))) }) }));
}
