import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const webDir = resolve(root, 'www');
const files = ['index.html', 'manifest.webmanifest', 'game.bundle.js', 'game.bundle.css', 'CaesarDressing-OFL.txt'];

rmSync(webDir, { recursive: true, force: true });
mkdirSync(resolve(webDir, 'assets'), { recursive: true });
for (const file of files) cpSync(resolve(root, file), resolve(webDir, file));
const assetReferences = new Set();
for (const bundle of ['game.bundle.js', 'game.bundle.css']) {
  const source = readFileSync(resolve(root, bundle), 'utf8');
  for (const match of source.matchAll(/assets\/([A-Za-z0-9._-]+)/g)) assetReferences.add(match[1]);
}
for (const file of assetReferences) {
  if (readdirSync(resolve(root, 'assets')).includes(file)) cpSync(resolve(root, 'assets', file), resolve(webDir, 'assets', file));
}
console.log(`Prepared Capacitor web assets at ${webDir} (${assetReferences.size} referenced assets)`);
