'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ShellLink } from './ShellLink.js'
import { chrome } from './navigation.js'
import type { ProximaApp, ProximaLink, ProximaNavigateHandler } from './types.js'

export type ProximaGiveMenuProps = {
  currentApp: ProximaApp
  /** "nav" is the header button; "prompt" is a gift touchpoint lower on a page. */
  variant?: 'nav' | 'prompt'
  /** Defaults to the release's button label ("Give"). */
  label?: string
  onNavigate?: ProximaNavigateHandler
}

// The Give menu: a disclosure button that reveals the ways to give. Opens on click or tap, closes on
// Escape or an outside click, and returns focus to the button. Items come from the Brand System release.
export function ProximaGiveMenu({ currentApp, variant = 'nav', label = chrome.header.give.label, onNavigate }: ProximaGiveMenuProps) {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  return (
    <div className={`proxima-shell-give proxima-shell-give--${variant}`} ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="proxima-shell-give__button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {label} <span aria-hidden="true">▾</span>
      </button>
      <ul className="proxima-shell-give__list" id={menuId} hidden={!open} aria-label={chrome.header.give.menuLabel}>
        {(chrome.header.give.items as readonly ProximaLink[]).map((item) => (
          <li key={item.label}>
            <ShellLink link={item} currentApp={currentApp} onNavigate={onNavigate} onClick={() => setOpen(false)}>
              <span className="proxima-shell-give__label">{item.label}</span>
              <span className="proxima-shell-give__description">{item.description}</span>
            </ShellLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
