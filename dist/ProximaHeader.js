'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { flushSync } from 'react-dom';
import { ProximaGiveMenu } from './ProximaGiveMenu.js';
import { ShellLink } from './ShellLink.js';
import { brandVersion, chrome, proximaLinkIsCurrent } from './navigation.js';
import { shellVersion } from './chrome.generated.js';
// The header for every page at liveproxima.org (Brand System 10-Site-Chrome, FB-022): the lockup,
// Who We Are, Stories, and the Give menu, with a menu button on phones.
export function ProximaHeader({ currentApp, currentPath, logoSrc, onNavigate }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const header = chrome.header;
    const links = header.nav;
    // A same-page section link (for example /#about while on /) whose hash is already in the address does
    // not scroll again on a second click. Handle that case only; leave every other click to the browser or
    // the app's router. The menu closes first so the scroll is measured without it.
    const jumpToSection = (event, link) => {
        flushSync(() => setMenuOpen(false));
        const h = link.href;
        if (!('app' in h) || h.app !== currentApp || !h.path.includes('#'))
            return;
        const [path, hash] = h.path.split('#');
        if ((path || '/') !== currentPath || window.location.hash !== `#${hash}`)
            return;
        const target = document.getElementById(hash);
        if (!target)
            return;
        event.preventDefault();
        target.scrollIntoView();
    };
    const navLink = (link) => (_jsx(ShellLink, { link: link, currentApp: currentApp, current: proximaLinkIsCurrent(link, currentApp, currentPath), onNavigate: onNavigate, onClick: (event) => jumpToSection(event, link) }, link.label));
    return (_jsxs(_Fragment, { children: [_jsx("a", { className: "proxima-shell-skip", href: header.skipLink.target, children: header.skipLink.label }), _jsxs("header", { className: "proxima-shell-header", "data-proxima-shell-version": shellVersion, "data-proxima-brand-version": brandVersion, children: [_jsxs("div", { className: "proxima-shell-header__inner", children: [_jsx(ShellLink, { link: { label: header.logo.label, href: header.logo.href }, currentApp: currentApp, className: "proxima-shell-header__logo", ariaLabel: header.logo.label, onNavigate: onNavigate, children: _jsx("img", { src: logoSrc, width: 560, height: 143, alt: header.logo.alt }) }), _jsx("nav", { className: "proxima-shell-header__nav", "aria-label": "Primary navigation", children: links.map(navLink) }), _jsxs("div", { className: "proxima-shell-header__actions", children: [_jsx(ProximaGiveMenu, { currentApp: currentApp, onNavigate: onNavigate }), _jsx("button", { className: "proxima-shell-header__menu", type: "button", "aria-expanded": menuOpen, "aria-controls": "proxima-shell-mobile-nav", "aria-label": menuOpen ? header.mobileMenu.closeLabel : header.mobileMenu.openLabel, onClick: () => setMenuOpen((open) => !open), children: _jsx("span", { className: "proxima-shell-header__burger", "aria-hidden": "true" }) })] })] }), _jsx("nav", { className: "proxima-shell-header__mobile", id: "proxima-shell-mobile-nav", "aria-label": "Mobile navigation", hidden: !menuOpen, children: links.map(navLink) })] })] }));
}
