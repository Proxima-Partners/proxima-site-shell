# Proxima Site Shell

Shared, versioned navbar and footer contract for the Proxima Partners Webflow site and [Proxima.Cafe](https://proxima.cafe).

## Current status

Both active code consumers currently pin the immutable package commit `77038f98ae7cb4e1c831c786c472e3577e0912f2`.

The repository's current `main` branch is documentation-only. The functional package tree remains available at the pinned commit, but it is not reachable from `main`. Before publishing another shell release:

1. Restore the functional tree from the pinned commit on a reviewed recovery branch.
2. Compare it with both live consumers and confirm the approved navigation contract.
3. Add CI for package, contract, and consumer-adapter tests.
4. Merge the recovery through review.
5. Keep existing consumers pinned until a new release passes their independent preview and deployment gates.

Do not move a consumer to `main`, a branch name, or an unversioned `latest` reference.

## Verified consumer matrix

| Consumer | Integration | Current shell | Update policy |
| --- | --- | --- | --- |
| Partners v1.3 | Compiled historical artifact | `2e5e16b33c0014d7da93b401956639096521b070` | Locked; never rebuild during normal shell updates |
| Partners v1.4 | Compiled historical artifact | `2e5e16b33c0014d7da93b401956639096521b070` | Locked; never rebuild during normal shell updates |
| Partners v1.5 | Root Vite/Preact build | `77038f98ae7cb4e1c831c786c472e3577e0912f2` | Active mutable release |
| Partners v1.6 / v1.6.3 | Release-specific React adapter and generated static artifact | `77038f98ae7cb4e1c831c786c472e3577e0912f2` | Active mutable release |
| Partners v1.6.4 | Isolated Next.js adapter | `77038f98ae7cb4e1c831c786c472e3577e0912f2` | Active package consumer |
| Partners v1.8.0 | Isolated Next.js adapter | `77038f98ae7cb4e1c831c786c472e3577e0912f2` | Draft consumer; currently missing from the consumer update manifest |
| Proxima.Cafe | Next.js adapter in its own repository | `77038f98ae7cb4e1c831c786c472e3577e0912f2` | Independently reviewed and released |
| Partners Webflow site | Native Webflow adapter generated from the shared contract | Record an explicit shell artifact version | Independently reviewed and published |

Partners v1.7 does not consume the package. Partners v1.9 is a native Framer reconstruction rather than a package consumer.

The Partners updater currently verifies the root v1.5/v1.6 package and v1.6.4. Before the next shell upgrade, either add v1.8.0 to `config/site-shell-consumers.json` or explicitly classify it as frozen/unaffected. Silent omission is not acceptable because it allows compatible-looking versions to drift.

## Recommended architecture

The two websites have different application architectures, so the shared shell should be a source-of-truth contract with consumer-specific adapters.

```text
proxima-site-shell
  shared navigation + footer schema
  shared design tokens
  shared accessibility and interaction rules
  shared contract tests
       |
       +-- React package -> Proxima.Cafe / Next.js adapter
       |
       +-- static Webflow artifact -> Partners / Webflow adapter
```

### Shared shell responsibilities

The shell repository owns:

- Approved navigation hierarchy, labels, ordering, and cross-site destinations
- Navbar and footer semantics
- Desktop dropdown and mobile-menu behavior
- Keyboard navigation, focus management, target sizes, and reduced motion
- Shared visual tokens and namespaced styles
- Link-resolution rules for Partners and Café destinations
- Contract fixtures and regression tests
- Versioned React and Webflow build artifacts

It does not own:

- A consumer's application router
- CMS, page content, story movements, or page layouts
- Authentication, membership, donations, newsletter forms, analytics, or integrations
- Consumer-specific version labels, logos, release banners, or adjacent footer content
- Staging or production deployment

Consumer-specific behavior belongs in a thin adapter, not in a fork of the shared component.

## Consumer adapters

### Proxima.Cafe

Proxima.Cafe is a Next.js application and should consume the React package directly.

The Café adapter should:

- Import `@proxima/site-shell/styles.css` once in the root layout.
- Render `ProximaNavbar` and `ProximaFooter` with `currentSite="cafe"`.
- Pass the current Next.js pathname.
- Intercept only Café destinations with the Next.js router.
- Leave Partners destinations as normal cross-domain browser navigation.
- Keep Café-only membership, tips, newsletter, CMS, and application behavior outside the shell.

### Partners Webflow site

Webflow should not be required to run or maintain the React application package.

The shell build should produce a framework-neutral Webflow artifact from the same contract:

- Static semantic navbar and footer markup or a deterministic renderer
- Namespaced CSS
- Minimal vanilla JavaScript for dropdown, mobile-menu, focus, scroll-lock, and reduced-motion behavior
- A machine-readable shell version such as `data-proxima-shell-version="0.2.0"`
- No page-specific M1-M9 selectors or application logic

Prefer an immutable, versioned artifact copied into or explicitly pinned by the Webflow site. Do not load an unversioned runtime file. A Webflow update must generate a reviewable structural and visual diff and must not publish the site automatically.

## Versioning and distribution

Use immutable Semantic Versioning after registry and release automation are approved.

- Patch: accessibility fix, styling correction, or behavior fix with no navigation-contract change
- Minor: backward-compatible prop, token, destination, or adapter capability
- Major: breaking markup, required-prop, selector, navigation-schema, or adapter change

Every release should include:

- Exact package version and Git tag
- React package artifact
- Webflow artifact
- Changelog with consumer impact
- Checksums or equivalent immutable artifact identity
- Migration notes when adapter work is required
- A tested rollback target

Until package publication is configured, consumers may pin a full 40-character Git commit. Commit pinning is reproducible, but it is a temporary distribution method rather than the desired release workflow.

## Change workflow

1. Open a shell pull request containing the shared-contract change and both generated artifacts.
2. Run shell unit, type, accessibility, interaction, link-resolution, and packaging tests.
3. Review the navigation matrix for both `currentSite="partners"` and `currentSite="cafe"`.
4. Create an immutable release candidate.
5. Open separate consumer updates:
   - A dependency/adaptor pull request for Proxima.Cafe.
   - A Webflow sync plan with selector, ID, embedded-code, token, and component diffs.
6. Run consumer-specific verification:
   - Café: typecheck, lint, production build, desktop/mobile interaction tests, and isolated preview.
   - Webflow: structural audit, desktop/mobile Designer snapshots, link checks, keyboard checks, and unpublished preview review.
7. Approve each consumer independently.
8. Promote each consumer through staging and production as separate approvals.
9. Roll back by restoring the previous exact package or Webflow artifact version.

A shell release must never automatically merge a consumer update, publish Webflow, deploy Café, or promote either site to production.

## Required contract tests

At minimum, test:

- Partners and Café destination resolution
- Same-site router interception and cross-site browser navigation
- Active-link behavior
- Desktop dropdown keyboard and pointer behavior
- Mobile dialog focus trap, Escape close, scroll lock, and focus return
- Reduced-motion behavior
- Navbar persistence while scrolling
- Footer links and nonprofit/Candid presentation
- No selector collision outside the `proxima-shell-` namespace
- Responsive layouts at 320, 375, 768, 1440, and 1920 pixels
- Both consumer adapters against the same release candidate

## Existing consumer workflow

The Partners code repository documents its current updater in `docs/SITE-SHELL-UPDATES.md` and `scripts/update-site-shell.mjs`. That updater should remain a consumer-side integration tool. It must not become the source of the shell itself.

Active and locked historical releases must continue to follow the consumer manifest and release-lock rules. Proxima.Cafe should retain its own Next.js adapter and production verification because its routing and application services differ from Webflow.

## Release boundaries

Treat these as separate approval gates:

1. Shell design and navigation contract
2. Shell implementation
3. Package or artifact publication
4. Café consumer update
5. Webflow consumer update
6. Café staging
7. Webflow preview
8. Café production
9. Webflow publication

Passing automated checks does not substitute for reviewing navigation, responsive behavior, accessibility, and each consumer's preview.
