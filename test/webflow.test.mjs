import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { access, readFile } from 'node:fs/promises'
import { test } from 'node:test'
import {
  renderProximaWebflowFooter,
  renderProximaWebflowNavbar,
} from '../dist/webflow.js'

const options = {
  currentPath: '/',
  currentSite: 'partners',
  logoSrc: '/brand/header.png',
  footerLogoSrc: '/brand/footer.png',
  designVersionLabel: 'Webflow draft',
  shellVersion: '0.1.0',
}

test('renders the Webflow navbar from the shared navigation contract', () => {
  const markup = renderProximaWebflowNavbar(options)

  assert.match(markup, /data-proxima-shell-renderer="webflow"/)
  assert.match(markup, /data-proxima-shell-version="0\.1\.0"/)
  assert.match(markup, />Stories</)
  assert.match(markup, /href="https:\/\/proxima\.cafe\/"/)
  assert.match(markup, /href="https:\/\/proxima\.cafe\/blog"/)
  assert.match(markup, /href="https:\/\/proxima\.cafe\/articles"/)
  assert.match(markup, /proxima-shell-mobile-menu/)
  assert.equal(markup.match(/data-proxima-shell-group=/g)?.length, 2)
  assert.doesNotMatch(markup, /\bm[1-9]-/)
})

test('renders the Webflow footer with consumer-owned version data', () => {
  const markup = renderProximaWebflowFooter(options)

  assert.match(markup, /Webflow draft/)
  assert.match(markup, /proxima-shell-footer__candid/)
  assert.match(markup, /href="\/contact#contact-form"/)
  assert.match(markup, /href="\/privacy-policy"/)
  assert.doesNotMatch(markup, /\bm[1-9]-/)
})

test('build emits a machine-readable Webflow artifact manifest', async () => {
  const manifest = JSON.parse(
    await readFile(new URL('../dist/webflow/manifest.json', import.meta.url), 'utf8'),
  )

  assert.equal(manifest.schemaVersion, 1)
  assert.equal(manifest.packageName, '@proxima/site-shell')
  assert.equal(manifest.packageVersion, '0.1.0')
  assert.equal(manifest.adapter, 'webflow')
  assert.equal(manifest.entrypoint, './index.js')
  assert.match(manifest.artifacts['index.js'].sha256, /^[a-f0-9]{64}$/)
  assert.equal(manifest.footerNavigation[0].label, 'Contact')
  assert.equal(manifest.policyNavigation[0].label, 'Privacy Policy')
  assert.equal(manifest.navigation.groups[0].label, 'Stories')
  for (const [path, artifact] of Object.entries(manifest.artifacts)) {
    const url = new URL(`../dist/webflow/${path}`, import.meta.url)
    await access(url)
    const contents = await readFile(url)
    assert.equal(contents.byteLength, artifact.bytes)
    assert.equal(createHash('sha256').update(contents).digest('hex'), artifact.sha256)
  }
})

test('shared styles support both React wrappers and direct Webflow groups', async () => {
  const styles = await readFile(new URL('../dist/styles.css', import.meta.url), 'utf8')

  assert.match(styles, /\.proxima-shell-desktop-nav > span,\s*\.proxima-shell-desktop-nav > \.proxima-shell-dropdown/)
  assert.match(styles, /\.proxima-shell-mobile-nav > span,\s*\.proxima-shell-mobile-nav > \.proxima-shell-mobile-group/)
})
