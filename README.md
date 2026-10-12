# Proxima Site Shell

The header, Give menu, section bar and footer for every page at **liveproxima.org**: the main site and the Proxima Cafe, which is served at `/cafe` through Vercel microfrontends. A visitor moves between the two apps without seeing a seam.

## Where the content comes from

The Brand System owns the header and footer. This package only delivers them.

- The labels, order, destinations, Give menu items, cafe section bar and footer come from `10-Site-Chrome/navigation.json` in a tagged Proxima Brand System release (2.2.0 and later). The Brand Book page is "Header and footer" (R18, page 51).
- `npm run brand:sync -- vX.Y.Z` mirrors that file and `tokens.json` into `./brand` and records the tag, commit and hashes in `brand.lock.json`. The mirror is read-only.
- The build generates `src/chrome.generated.ts` from the mirror. Nothing is typed by hand. To change a label or link, change the Brand System through a brand change request and a release, then sync here.
- `npm run brand:check` fails if the mirror was edited, if the locked tag moved, or if `src/styles.css` uses a color outside the palette.
- Styles use only Brand System tokens (`--proxima-*`). The consuming app must load the same release's `tokens.css`.

## Consumers

| App | Repository | Vercel project | Mounted at |
| --- | --- | --- | --- |
| Main site v1.0 | `proxima-simple-website` (`design/v1.0`) | `proxima-simple-website-production` (microfrontends default app) | `/` |
| Proxima Cafe | `proxima-cafe-webdesign` | `proxima-cafe-webdesign` (child app, `basePath: "/cafe"`) | `/cafe` |

Both apps must pin the same shell version, and that version must be built from the Brand System release both apps are locked to. Archived main-site versions (v0.5 to v1.8, including the checksum-locked v1.3 and v1.4) keep whatever they pinned and are not upgraded.

## Using it (Next.js)

```tsx
// app/layout.tsx: load the release tokens, then the shell styles
import '../brand/tokens/tokens.css'
import '@proxima/site-shell/styles.css'
```

```tsx
'use client'
import { usePathname, useRouter } from 'next/navigation'
import { ProximaFooter, ProximaHeader, ProximaSectionBar } from '@proxima/site-shell'

export function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() // path inside this app, without basePath
  const router = useRouter()
  // Route same-app links client-side; leave cross-app, external and Fundraise Up links to the browser.
  const onNavigate = (event, { sameApp, appPath }) => {
    if (!sameApp || !appPath || event.metaKey || event.ctrlKey || event.shiftKey) return
    event.preventDefault()
    router.push(appPath)
  }
  return (
    <>
      <ProximaHeader currentApp="cafe" currentPath={pathname} logoSrc="/cafe/brand/logos/Proxima-SF-lockup.svg" onNavigate={onNavigate} />
      <ProximaSectionBar section="cafe" currentApp="cafe" currentPath={pathname} onNavigate={onNavigate} />
      {children}
      <ProximaFooter currentApp="cafe" assetBase="/cafe" onNavigate={onNavigate} />
    </>
  )
}
```

- The main site uses `currentApp="main"`, no section bar, and may pass `versionLabel="v1.0"` to the footer.
- `ProximaGiveMenu` is exported for gift prompts lower on a page (`variant="prompt"`, optional `label`).
- The Give menu's "Give securely online" item is a `?form=` link. Every app that shows the header must load the Fundraise Up loader so they open checkout in place.
- The header and footer carry `data-proxima-shell-version` and `data-proxima-brand-version`, so a check on the live site can confirm both apps match.
- Optional CSS hooks: `--proxima-shell-width`, `--proxima-shell-sans` (for example the app's `next/font` variable), `--proxima-shell-header-height`.

## Versioning

Pin an exact version or 40-character commit, never `main`, a branch or `latest`.

- **Patch:** an accessibility, styling or behavior fix with no content or markup change.
- **Minor:** a new Brand System release synced in, or a backward-compatible prop.
- **Major** (or minor while 0.x): breaking markup, props or class names.

Every release records its Brand System tag in the CHANGELOG.

## Release gates

Each is a separate approval by Mike Edwards:

1. Shell implementation (this repository)
2. Shell tag
3. Main site update, preview and production
4. Cafe update, preview and production

A shell release never merges a consumer update or deploys either app automatically. Both apps must be on the new version before the release counts as rolled out.

## Local verification

```sh
npm ci
npm test          # build, brand check, contract and render tests
npm run pack:check
git diff --check
```
