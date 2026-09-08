import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'

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

const packageJson = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8'),
)
const { defaultProximaBaseUrls, defaultProximaNavigation } = await import(
  new URL('../dist/navigation.js', import.meta.url)
)
const {
  defaultProximaFooterNavigation,
  defaultProximaPolicyNavigation,
} = await import(new URL('../dist/navigation.js', import.meta.url))
const webflowDirectory = new URL('../dist/webflow/', import.meta.url)

await mkdir(webflowDirectory, { recursive: true })
await cp(
  new URL('../dist/webflow.js', import.meta.url),
  new URL('../dist/webflow/index.js', import.meta.url),
)
await cp(
  new URL('../dist/navigation.js', import.meta.url),
  new URL('../dist/webflow/navigation.js', import.meta.url),
)
await cp(
  new URL('../src/styles.css', import.meta.url),
  new URL('../dist/webflow/styles.css', import.meta.url),
)

const artifactFiles = ['index.js', 'navigation.js', 'styles.css']
const artifacts = Object.fromEntries(await Promise.all(
  artifactFiles.map(async (path) => {
    const contents = await readFile(new URL(path, webflowDirectory))
    return [path, {
      bytes: contents.byteLength,
      sha256: createHash('sha256').update(contents).digest('hex'),
    }]
  }),
))

await writeFile(
  new URL('../dist/webflow/manifest.json', import.meta.url),
  `${JSON.stringify({
    schemaVersion: 1,
    packageName: packageJson.name,
    packageVersion: packageJson.version,
    adapter: 'webflow',
    entrypoint: './index.js',
    stylesheet: './styles.css',
    artifacts,
    baseUrls: defaultProximaBaseUrls,
    navigation: defaultProximaNavigation,
    footerNavigation: defaultProximaFooterNavigation,
    policyNavigation: defaultProximaPolicyNavigation,
  }, null, 2)}\n`,
)
