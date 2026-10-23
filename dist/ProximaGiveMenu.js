'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef, useState } from 'react';
import { ShellLink } from './ShellLink.js';
import { chrome } from './navigation.js';
// The Give menu: a disclosure button that reveals the ways to give. Opens on click or tap, closes on
// Escape or an outside click, and returns focus to the button. Items come from the Brand System release.
export function ProximaGiveMenu({ currentApp, variant = 'nav', label = chrome.header.give.label, onNavigate }) {
    const [open, setOpen] = useState(false);
    const menuId = useId();
    const rootRef = useRef(null);
    const buttonRef = useRef(null);
    useEffect(() => {
        if (!open)
            return;
        const onKey = (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
                buttonRef.current?.focus();
            }
        };
        const onPointer = (event) => {
            if (!rootRef.current?.contains(event.target))
                setOpen(false);
        };
        document.addEventListener('keydown', onKey);
        document.addEventListener('pointerdown', onPointer);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('pointerdown', onPointer);
        };
    }, [open]);
    return (_jsxs("div", { className: `proxima-shell-give proxima-shell-give--${variant}`, ref: rootRef, children: [_jsxs("button", { ref: buttonRef, type: "button", className: "proxima-shell-give__button", "aria-expanded": open, "aria-controls": menuId, onClick: () => setOpen((value) => !value), children: [label, " ", _jsx("span", { "aria-hidden": "true", children: "\u25BE" })] }), _jsx("ul", { className: "proxima-shell-give__list", id: menuId, hidden: !open, "aria-label": chrome.header.give.menuLabel, children: chrome.header.give.items.map((item) => (_jsx("li", { children: _jsxs(ShellLink, { link: item, currentApp: currentApp, onNavigate: onNavigate, onClick: () => setOpen(false), children: [_jsx("span", { className: "proxima-shell-give__label", children: item.label }), _jsx("span", { className: "proxima-shell-give__description", children: item.description })] }) }, item.label))) })] }));
}
