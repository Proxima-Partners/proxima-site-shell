# Proxima Site Shell

Shared, versioned navbar and footer components for LiveProxima and Proxima.Cafe.

## Status

`0.1.0` is the initial extraction of the navbar and footer approved for the LiveProxima v1.5.3 preview. This repository is private and the package is not yet published to a registry. Publishing and consumer adoption are separate approval gates.

## What the package owns

- Approved primary navigation and cross-site destinations
- Desktop dropdown and anchored mobile-menu behavior
- Keyboard, focus, reduced-motion, and target-size behavior
- Minimal shared organizational footer
- Official dynamic Candid SVG widget
- Scoped component CSS and Proxima design-token fallbacks

The package does not own application routing, site-specific account or subscription features, deployment, or a consumer's design-version label.

## Install for local validation

```sh
npm install
npm test
npm pack
```

Install the resulting tarball in a consumer for an integration check. Pin exact released versions once a package registry is selected.

## Usage

Import the stylesheet once at the application root:

```ts
import '@proxima/site-shell/styles.css'
```

Render the shared components with site-owned routing and version data:

```tsx
import { ProximaFooter, ProximaNavbar } from '@proxima/site-shell'

export function SiteShell({ currentPath }: { currentPath: string }) {
  return <>
    <ProximaNavbar
      currentPath={currentPath}
      currentSite="partners"
      logoSrc="/brand/proxima-sf-logo.png"
    />
    <main>{/* Site content */}</main>
    <ProximaFooter
      currentSite="partners"
      designVersionLabel="v1.5.3 preview"
      logoSrc="/brand/proxima-partners-footer.png"
    />
  </>
}
```

Use `currentSite="cafe"` in Proxima.Cafe. Same-site links can be intercepted through `onNavigate` and passed to the consumer router; cross-site links should retain their normal browser navigation.

## Styling contract

All selectors use the `proxima-shell-` namespace. Consumers may supply their established Proxima tokens (`--teal`, `--gold`, `--cream`, `--ink`, and related RGB tokens); safe brand defaults are included.

Navbar labels share a single `1rem` size. Give Now uses the approved 6px radius, gold resting state, and branded teal hover/focus state.

## Release discipline

- Build-time package dependency only; do not load shell code from a runtime CDN.
- Consumers pin exact package versions.
- Historical locked site releases remain self-contained and unchanged.
- Package publication, consumer upgrades, staging, and production are independent approvals.
- Responsive acceptance checks use Microsoft Edge.
