# Changelog

All notable site-shell changes are recorded here. A release entry identifies its Brand System release, consumer impact, migration requirements and the tested rollback version.

## 0.2.2 - 2026-10-11

Brand System: v2.2.2 (`10-Site-Chrome/navigation.json`).

- The Give menu's "Donor-Advised Fund (DAF)" item and the footer DAF badge go to `/give#daf` on the main site, in the same tab, instead of DonateStock's DAF checkout (Mike, 2026-10-11).

Consumer impact: link destinations only; no prop, markup-structure or CSS changes. The main site serves `#daf` from v1.0 (v0.5 has no such section), so the cafe adopts 0.2.2 together with the main site v1.0 launch. Rollback: 0.2.1 at `0819896`.

## 0.2.1 - 2026-10-10

Brand System: v2.2.1 (unchanged).

- `exports` adds a `default` condition, so tools that resolve through `require` (for example tsx in tests) load the package.
- Phone (640px and below): the header's Give menu opens as a full-width sheet under the header, as on main site v1.0. Gift prompt menus are unchanged.

Consumer impact: CSS only. Rollback: 0.2.0 at `932f614`.

## 0.2.0 - 2026-10-10

Brand System: v2.2.1 (`10-Site-Chrome/navigation.json`).

Breaking. The shell now delivers the Brand System's header and footer for every page at liveproxima.org, with the cafe served at `/cafe`.

- **Content:** comes only from the Brand System release, mirrored into `./brand` (`brand:sync`, `brand:check`, `brand.lock.json`) and generated at build. Nothing is typed by hand.
- **Header:** the lockup, Who We Are, Stories (to `/cafe`) and the Give menu with the six ways to give (FB-022, FB-024). Rebuilt from main site v1.0's header and Give menu. The Home link, the Stories and About dropdowns, "GIVE NOW" and the mobile dialog are gone.
- **New components:** `ProximaSectionBar` for the cafe (Proxima Cafe, Blog, Articles, Interviews). The cafe is named only there. `ProximaGiveMenu` is exported for gift prompts.
- **Footer:** v1.0's footer (details, DAF and Candid badges, policy links, meta line), plus the quiet Teal semibold Give link after the policy links (Brand System 2.2.1).
- **Links:** root-relative on liveproxima.org in both apps, no more cross-domain URLs. `onNavigate` receives `{ href, sameApp, appPath }` so an app can route its own links. External links open a new tab; nothing else does.
- **Styles:** Brand System tokens only, under the `proxima-shell-` namespace. `brand:check` fails on any off-palette color. The pre-2.0 colors and Noto Sans are removed.
- **Version stamps:** the header and footer carry `data-proxima-shell-version` and `data-proxima-brand-version`.
- **Removed:** the Webflow adapter and its artifact. It was never published and no live site used it; the Webflow redesign is not served at liveproxima.org.
- **Renamed props:** `currentSite` ("partners" or "cafe") is now `currentApp` ("main" or "cafe"). `ProximaNavbar` is now `ProximaHeader`. `logoSrc` points to the SF lockup.

Migration: see README "Using it". Both consumers must move together. Rollback: 0.1.0 at `c0e1c4d`.

## 0.1.0

- React navbar and footer, recovered onto `main` (`5ebbe6d`, `c0e1c4d`), with a framework-neutral Webflow renderer. Pinned by the cafe and main-site versions v0.5, v1.0, v1.6.4 and v1.8.0 at `c0e1c4d`.
