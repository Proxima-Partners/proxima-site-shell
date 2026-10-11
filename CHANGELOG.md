# Changelog

All notable site-shell changes are recorded here. A release entry identifies its Brand System release, consumer impact, migration requirements and the tested rollback version.

## 0.2.0 - unreleased

Brand System: v2.2.0 (`10-Site-Chrome/navigation.json`).

Breaking. The shell now delivers the Brand System's header and footer for every page at liveproxima.org, with the cafe served at `/cafe`.

- **Content:** comes only from the Brand System release, mirrored into `./brand` (`brand:sync`, `brand:check`, `brand.lock.json`) and generated at build. Nothing is typed by hand.
- **Header:** the lockup, Who We Are, Stories (to `/cafe`) and the Give menu with the six ways to give (FB-022, FB-024). Rebuilt from main site v1.0's header and Give menu. The Home link, the Stories and About dropdowns, "GIVE NOW" and the mobile dialog are gone.
- **New components:** `ProximaSectionBar` for the cafe (Proxima Cafe, Blog, Articles, Interviews). The cafe is named only there. `ProximaGiveMenu` is exported for gift prompts.
- **Footer:** v1.0's footer: details, DAF and Candid badges, policy links and the meta line.
- **Links:** root-relative on liveproxima.org in both apps, no more cross-domain URLs. `onNavigate` receives `{ href, sameApp, appPath }` so an app can route its own links. External links open a new tab; nothing else does.
- **Styles:** Brand System tokens only, under the `proxima-shell-` namespace. `brand:check` fails on any off-palette color. The pre-2.0 colors and Noto Sans are removed.
- **Version stamps:** the header and footer carry `data-proxima-shell-version` and `data-proxima-brand-version`.
- **Removed:** the Webflow adapter and its artifact. It was never published and no live site used it; the Webflow redesign is not served at liveproxima.org.
- **Renamed props:** `currentSite` ("partners" or "cafe") is now `currentApp` ("main" or "cafe"). `ProximaNavbar` is now `ProximaHeader`. `logoSrc` points to the SF lockup.

Migration: see README "Using it". Both consumers must move together. Rollback: 0.1.0 at `c0e1c4d`.

## 0.1.0

- React navbar and footer, recovered onto `main` (`5ebbe6d`, `c0e1c4d`), with a framework-neutral Webflow renderer. Pinned by the cafe and main-site versions v0.5, v1.0, v1.6.4 and v1.8.0 at `c0e1c4d`.
