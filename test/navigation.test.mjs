import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  defaultProximaNavigation,
  proximaDestinationIsCurrent,
  resolveProximaHref,
} from '../dist/index.js'

test('ships the approved shared information architecture', () => {
  assert.equal(defaultProximaNavigation.home.label, 'Home')
  assert.deepEqual(
    defaultProximaNavigation.groups.map(({ label, destinations }) => ({
      label,
      destinations: destinations.map((destination) => destination.label),
    })),
    [
      { label: 'Stories', destinations: ['Impact', 'Blog', 'Articles'] },
      { label: 'About', destinations: ['Mission', 'Leadership', 'Contact'] },
    ],
  )
  assert.equal(defaultProximaNavigation.primaryAction.label, 'GIVE NOW')
})

test('uses relative URLs on the current site and absolute URLs across sites', () => {
  const impact = defaultProximaNavigation.groups[0].destinations[0]
  const blog = defaultProximaNavigation.groups[0].destinations[1]
  const mission = defaultProximaNavigation.groups[1].destinations[0]

  assert.equal(resolveProximaHref(impact, 'partners'), '/impact')
  assert.equal(resolveProximaHref(blog, 'partners'), 'https://proxima.cafe/blog')
  assert.equal(resolveProximaHref(mission, 'cafe'), 'https://liveproxima.org/about#mission')
})

test('marks only same-site destinations as current', () => {
  const impact = defaultProximaNavigation.groups[0].destinations[0]
  const blog = defaultProximaNavigation.groups[0].destinations[1]

  assert.equal(proximaDestinationIsCurrent(impact, 'partners', '/impact'), true)
  assert.equal(proximaDestinationIsCurrent(impact, 'partners', '/impact/report'), true)
  assert.equal(proximaDestinationIsCurrent(blog, 'partners', '/blog'), false)
  assert.equal(proximaDestinationIsCurrent(blog, 'cafe', '/blog'), true)
})
