import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  ProximaFooter,
  ProximaHeader,
  ProximaSectionBar,
  brandVersion,
  chrome,
  proximaLinkIsCurrent,
  resolveProximaLink,
  shellVersion,
} from '../dist/index.js'

const mirror = JSON.parse(readFileSync(new URL('../brand/site-chrome/navigation.json', import.meta.url), 'utf8'))
const lock = JSON.parse(readFileSync(new URL('../brand.lock.json', import.meta.url), 'utf8'))
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const nav = (label) => chrome.header.nav.find((link) => link.label === label)

test('ships exactly the Brand System release it is locked to', () => {
  const { $comment, ...content } = mirror
  assert.deepEqual(JSON.parse(JSON.stringify(chrome)), content)
  assert.equal(brandVersion, lock.version)
  assert.equal(shellVersion, pkg.version)
})

test('the top bar reads Who We Are, Stories, Give (FB-022)', () => {
  assert.deepEqual(chrome.header.nav.map((link) => link.label), ['Who We Are', 'Stories'])
  assert.equal(chrome.header.give.label, 'Give')
})

test('links stay on liveproxima.org: root-relative in both apps, cafe under /cafe', () => {
  const stories = nav('Stories')
  const about = nav('Who We Are')
  assert.equal(resolveProximaLink(stories, 'main').href, '/cafe')
  assert.equal(resolveProximaLink(stories, 'main').sameApp, false)
  assert.deepEqual(resolveProximaLink(stories, 'cafe'), { link: stories, href: '/cafe', sameApp: true, appPath: '/' })
  assert.equal(resolveProximaLink(about, 'cafe').href, '/#about')
  assert.equal(resolveProximaLink(about, 'main').appPath, '/#about')
  const blog = chrome.sectionBars.cafe.items.find((link) => link.label === 'Blog')
  assert.equal(resolveProximaLink(blog, 'cafe').href, '/cafe/blog')
  assert.equal(resolveProximaLink(blog, 'cafe').appPath, '/blog')
})

test('Fundraise Up and external links are never handed to an app router', () => {
  const [online, daf] = chrome.header.give.items
  assert.deepEqual([resolveProximaLink(online, 'cafe').href, resolveProximaLink(online, 'cafe').sameApp], ['?form=FUNYXMNPKXG', false])
  assert.equal(resolveProximaLink(daf, 'main').sameApp, false)
  assert.match(resolveProximaLink(daf, 'main').href, /^https:\/\/donatestock\.com\//)
})

test('marks the current page only inside its own app', () => {
  const blog = chrome.sectionBars.cafe.items.find((link) => link.label === 'Blog')
  assert.equal(proximaLinkIsCurrent(blog, 'cafe', '/blog'), true)
  assert.equal(proximaLinkIsCurrent(blog, 'cafe', '/blog/a-story'), true)
  assert.equal(proximaLinkIsCurrent(blog, 'main', '/blog'), false)
  assert.equal(proximaLinkIsCurrent(nav('Who We Are'), 'main', '/'), false)
})

test('the header and footer render the same markup in both apps, stamped with both versions', () => {
  const render = (app) => renderToStaticMarkup(h('div', null,
    h(ProximaHeader, { currentApp: app, currentPath: '/', logoSrc: '/brand/logos/Proxima-SF-lockup.svg' }),
    h(ProximaFooter, { currentApp: app }),
  ))
  const main = render('main')
  const cafe = render('cafe')
  assert.equal(main.replaceAll(' aria-current="page"', ''), cafe.replaceAll(' aria-current="page"', ''))
  assert.equal((cafe.match(/aria-current="page">Stories</g) ?? []).length, 2, 'in the cafe, Stories is the current page (desktop and mobile)')
  for (const html of [main, cafe]) {
    assert.match(html, new RegExp(`data-proxima-shell-version="${pkg.version}" data-proxima-brand-version="${lock.version}"`))
    assert.match(html, /href="\/cafe"( aria-current="page")?>Stories</)
    assert.match(html, /href="\/#about">Who We Are</)
    assert.match(html, /aria-label="Proxima San Francisco, home"/)
    assert.equal((html.match(/target="_blank"/g) ?? []).length, 4, 'only the two external Give items and the two badges open a new tab')
    assert.match(html, new RegExp(`© ${new Date().getFullYear()} Proxima Partners, Inc.`))
    assert.doesNotMatch(html, /Proxima Cafe/, 'the cafe is named only in its section bar')
  }
})

test('the cafe section bar names the cafe and links inside /cafe', () => {
  const html = renderToStaticMarkup(h(ProximaSectionBar, { section: 'cafe', currentApp: 'cafe', currentPath: '/articles' }))
  assert.match(html, /aria-label="Proxima Cafe"/)
  assert.match(html, /href="\/cafe\/articles" aria-current="page">Articles</)
})
