'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ShellLink } from './ShellLink.js';
import { brandVersion, chrome, proximaFooterMeta } from './navigation.js';
import { shellVersion } from './chrome.generated.js';
// The footer for every page at liveproxima.org (Brand System 10-Site-Chrome): details, the DAF and Candid
// badges, the policy links and the meta line.
export function ProximaFooter({ currentApp, assetBase = '', versionLabel, onNavigate }) {
    const footer = chrome.footer;
    const image = (src) => (/^https?:\/\//.test(src) ? src : `${assetBase}${src}`);
    return (_jsx("footer", { className: "proxima-shell-footer", "data-proxima-shell-version": shellVersion, "data-proxima-brand-version": brandVersion, children: _jsxs("div", { className: "proxima-shell-footer__inner", children: [_jsxs("div", { className: "proxima-shell-footer__details", children: [_jsx("p", { children: footer.details[0] }), _jsx("address", { children: footer.details[1] }), footer.details.slice(2).map((line) => _jsx("p", { children: line }, line))] }), _jsx("div", { className: "proxima-shell-footer__badges", children: footer.badges.map((badge) => (_jsx(ShellLink, { link: badge, currentApp: currentApp, className: "proxima-shell-footer__badge", ariaLabel: badge.label, onNavigate: onNavigate, children: _jsx("img", { alt: badge.alt, src: image(badge.image), width: 76, height: 76, loading: "lazy" }) }, badge.label))) }), _jsxs("nav", { className: "proxima-shell-footer__policies", "aria-label": "Policies", children: [footer.policies.map((link) => (_jsx(ShellLink, { link: link, currentApp: currentApp, onNavigate: onNavigate }, link.label))), _jsx(ShellLink, { link: footer.give, currentApp: currentApp, className: "proxima-shell-footer__give", onNavigate: onNavigate })] }), _jsxs("p", { className: "proxima-shell-footer__meta", suppressHydrationWarning: true, children: [proximaFooterMeta(), versionLabel ? _jsxs(_Fragment, { children: [_jsx("span", { "aria-hidden": "true", children: "|" }), versionLabel] }) : null] })] }) }));
}
