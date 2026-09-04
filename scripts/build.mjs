import { cp, rm } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

await rm(new URL('../dist', import.meta.url), { recursive: true, force: true })

const typeScript = spawnSync(
  process.execPath,
  ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.build.json'],
  { cwd: new URL('..', import.meta.url), stdio: 'inherit' },
)

if (typeScript.status !== 0) process.exit(typeScript.status ?? 1)

await cp(
  new URL('../src/styles.css', import.meta.url),
  new URL('../dist/styles.css', import.meta.url),
)
