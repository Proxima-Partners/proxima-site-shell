#!/usr/bin/env node
// Mirrors the header and footer definition from an approved Proxima-Brand-System release into ./brand
// and rewrites brand.lock.json. Files are read from the release tag with `git show`, so the Brand System
// working tree is never touched. The mirror is read-only: never hand-edit files in ./brand.
//
// Usage: npm run brand:sync -- v2.2.0   (defaults to the newest vX.Y.Z tag)
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const brandRepo = resolve(process.env.PROXIMA_BRAND_SYSTEM ?? join(root, '..', 'Proxima-Brand-System'))

if (!existsSync(join(brandRepo, '.git'))) {
  console.error(`Brand System not found at ${brandRepo}. Set PROXIMA_BRAND_SYSTEM to its path.`)
  process.exit(1)
}

const git = (...args) => execFileSync('git', ['-C', brandRepo, ...args], { stdio: ['ignore', 'pipe', 'ignore'] })
const gitText = (...args) => git(...args).toString('utf8').trim()

const tags = gitText('tag', '--list', 'v*', '--sort=-v:refname').split('\n').filter((t) => /^v\d+\.\d+\.\d+$/.test(t))
const tag = process.argv[2] ?? tags[0]
if (!tags.includes(tag)) {
  console.error(`${tag ?? '(none)'} is not a released vX.Y.Z tag in the Brand System. Only approved releases may be mirrored.`)
  process.exit(1)
}
const commit = gitText('rev-list', '-n', '1', tag)

// [path in the Brand System, path in this repo]
export const mirror = [
  ['10-Site-Chrome/navigation.json', 'brand/site-chrome/navigation.json'],
  ['03-Design-Tokens/tokens.json', 'brand/tokens/tokens.json'],
]

rmSync(join(root, 'brand'), { recursive: true, force: true })
const files = {}
for (const [from, to] of mirror) {
  let content
  try {
    content = git('show', `${commit}:${from}`)
  } catch {
    console.error(`${from} is not in Brand System ${tag}. The header and footer definition starts with 2.2.0.`)
    process.exit(1)
  }
  mkdirSync(dirname(join(root, to)), { recursive: true })
  writeFileSync(join(root, to), content)
  files[to] = createHash('sha256').update(content).digest('hex')
}

const tokens = JSON.parse(git('show', `${commit}:03-Design-Tokens/tokens.json`).toString('utf8'))
const lock = {
  source: 'https://github.com/Proxima-Partners/Proxima-Brand-System',
  version: tokens.meta.version,
  tag,
  commit,
  syncedAt: new Date().toISOString(),
  files,
}
writeFileSync(join(root, 'brand.lock.json'), JSON.stringify(lock, null, 2) + '\n')
console.log(`Synced Brand System ${lock.version} (${tag} @ ${commit.slice(0, 7)}): ${Object.keys(files).length} files`)
