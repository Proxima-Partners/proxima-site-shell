#!/usr/bin/env node
// Verifies the shell still matches the Brand System release it was locked to.
//  1. The ./brand mirror is unmodified (hashes match brand.lock.json).
//  2. If the Brand System checkout is available, the locked tag still points at the locked commit and
//     every mirrored file equals that commit's file.
//  3. src/styles.css uses only palette colors (hex values must come from the mirrored tokens).
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const brandRepo = resolve(process.env.PROXIMA_BRAND_SYSTEM ?? join(root, '..', 'Proxima-Brand-System'))
const sources = {
  'brand/site-chrome/navigation.json': '10-Site-Chrome/navigation.json',
  'brand/tokens/tokens.json': '03-Design-Tokens/tokens.json',
}
const errors = []
const warnings = []

const lockPath = join(root, 'brand.lock.json')
if (!existsSync(lockPath)) {
  console.error('brand.lock.json missing. Run: npm run brand:sync')
  process.exit(1)
}
const lock = JSON.parse(readFileSync(lockPath, 'utf8'))
if (!/^v\d+\.\d+\.\d+$/.test(lock.tag ?? '')) errors.push('brand.lock.json has no release tag. Re-sync from a tagged release: npm run brand:sync')
for (const file of Object.keys(sources)) if (!(file in lock.files)) errors.push(`${file} is not in brand.lock.json. Run: npm run brand:sync`)

for (const [file, expected] of Object.entries(lock.files)) {
  const p = join(root, file)
  const actual = existsSync(p) ? createHash('sha256').update(readFileSync(p)).digest('hex') : null
  if (actual !== expected) errors.push(`${file} differs from the locked Brand System ${lock.version}. Mirror files are read-only.`)
}

if (existsSync(join(brandRepo, '.git'))) {
  const git = (...a) => execFileSync('git', ['-C', brandRepo, ...a], { stdio: ['ignore', 'pipe', 'ignore'] })
  const tags = git('tag', '--list', 'v*', '--sort=-v:refname').toString().trim().split('\n').filter(Boolean)
  if (!tags.includes(lock.tag)) warnings.push(`Locked tag ${lock.tag} not found in the Brand System checkout (try: git fetch --tags).`)
  else {
    if (git('rev-list', '-n', '1', lock.tag).toString().trim() !== lock.commit) errors.push(`Tag ${lock.tag} no longer points at locked commit ${lock.commit.slice(0, 7)}. A release tag must never move.`)
    for (const file of Object.keys(lock.files)) {
      try {
        const upstream = git('show', `${lock.commit}:${sources[file]}`)
        if (!upstream.equals(readFileSync(join(root, file)))) errors.push(`${file} differs from Brand System ${lock.tag}. The mirror was edited.`)
      } catch {
        errors.push(`${file} is not in Brand System ${lock.tag}.`)
      }
    }
    if (tags[0] !== lock.tag) warnings.push(`Brand System ${tags[0]} is available (locked: ${lock.tag}). Review its CHANGELOG, then run: npm run brand:sync -- ${tags[0]}`)
  }
} else {
  warnings.push(`Brand System checkout not found at ${brandRepo}; skipped upstream checks.`)
}

const tokens = JSON.parse(readFileSync(join(root, 'brand/tokens/tokens.json'), 'utf8'))
const palette = new Set(Object.values(tokens.color).map((c) => c.$value.toLowerCase()))
const css = readFileSync(join(root, 'src/styles.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
for (const [hex] of css.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
  if (!palette.has(hex.toLowerCase())) errors.push(`src/styles.css uses ${hex}, which is not a Brand System color. Use the --proxima-color-* tokens.`)
}

warnings.forEach((w) => console.warn(`warning ${w}`))
errors.forEach((e) => console.error(`error ${e}`))
if (errors.length) process.exit(1)
console.log(`Brand check passed: shell matches Brand System ${lock.version} (${lock.tag}).`)
