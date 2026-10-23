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
  const [online, daf, , stock] = chrome.header.give.items
  assert.deepEqual([resolveProximaLink(online, 'cafe').href, resolveProximaLink(online, 'cafe').sameApp], ['?form=FUNYXMNPKXG', false])
  assert.equal(resolveProximaLink(stock, 'main').sameApp, false)
  assert.match(resolveProximaLink(stock, 'main').href, /^https:\/\/donatestock\.com\//)
  // Brand System 3.1.3: DAF goes straight to DonateStock's DAF page, like Give stock (Mike, 2026-10-21).
  const dafPage = 'https://donatestock.com/donate/new/daf?ds_platform=easydaf&ein=334450216'
  assert.deepEqual([resolveProximaLink(daf, 'main').href, resolveProximaLink(daf, 'main').sameApp], [dafPage, false])
  assert.deepEqual([resolveProximaLink(daf, 'cafe').href, resolveProximaLink(daf, 'cafe').sameApp], [dafPage, false])
})

test('the Give menu has Give cryptocurrency and no Tributes (Brand System 2.3.0)', () => {
  const labels = chrome.header.give.items.map((item) => item.label)
  assert.equal(labels.includes('Tributes'), false)
  const crypto = chrome.header.give.items.find((item) => item.label === 'Give cryptocurrency')
  assert.equal(crypto.description, 'Donate cryptocurrency securely to Proxima.')
  // Brand System 3.1.3: straight to DonateStock's crypto page (Mike, 2026-10-21).
  assert.equal(resolveProximaLink(crypto, 'cafe').href, 'https://donatestock.com/donate/new/crypto?ds_platform=easycrypto&ein=334450216')
  assert.equal(resolveProximaLink(crypto, 'main').sameApp, false)
})

test('the Give menu says Give stock, filled out online (Brand System 2.4.1)', () => {
  const labels = chrome.header.give.items.map((item) => item.label)
  assert.equal(labels.includes('Give stock certificates'), false)
  const stock = chrome.header.give.items.find((item) => item.label === 'Give stock')
  assert.equal(stock.description, 'Fill out a short form online and DonateStock sends the transfer request to your broker.')
  // Brand System 3.1.2: DonateStock's Easy Button donation page; the old /donate/new/stock link is a 404.
  assert.match(resolveProximaLink(stock, 'main').href, /^https:\/\/donatestock\.com\/donate\/new\/\?ds_platform=easybutton&ein=334450216$/)
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
    assert.match(html, /<a class="proxima-shell-footer__give" href="\/give">Give<\/a><\/nav>/, 'quiet Give link after the policy links (2.2.1)')
    assert.equal((html.match(/target="_blank"/g) ?? []).length, 5, 'the DAF, stock and crypto Give items and both footer badges open a new tab (3.1.3)')
    assert.match(html, /<a class="proxima-shell-footer__badge" href="https:\/\/donatestock\.com\/donate\/new\/daf\?ds_platform=easydaf&amp;ein=334450216" aria-label="Donate to Proxima with your donor-advised fund" target="_blank"/, 'the DAF badge goes straight to DonateStock (3.1.3)')
    assert.match(html, new RegExp(`<p class="proxima-shell-footer__meta">© ${new Date().getFullYear()} Proxima Partners, Inc\\.`))
    assert.doesNotMatch(html, /Proxima Cafe/, 'the cafe is named only in its section bar')
  }
})

test('the cafe section bar names the cafe and links inside /cafe', () => {
  const html = renderToStaticMarkup(h(ProximaSectionBar, { section: 'cafe', currentApp: 'cafe', currentPath: '/articles' }))
  assert.match(html, /aria-label="Proxima Cafe"/)
  assert.match(html, /href="\/cafe\/articles" aria-current="page">Articles</)
})
