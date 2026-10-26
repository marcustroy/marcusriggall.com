// Kaizen's stylesheet ships global resets and :root tokens that would restyle the whole site
// (and clash with Tailwind's red/green/gray palettes). This keeps the component styles and
// moves the design tokens under .kaizen-scope so they only apply inside Kaizen UI.
import { readFileSync, writeFileSync } from 'node:fs';

const source = readFileSync('node_modules/@kaizen/components/dist/styles.css', 'utf8');

function readBlock(css, start) {
  let depth = 0;
  for (let i = start; i < css.length; i++) {
    if (css[i] === '{') depth++;
    if (css[i] === '}' && --depth === 0) return i + 1;
  }
  throw new Error('Unbalanced braces');
}

let out = '';
let i = 0;
let tokens = '';
while (i < source.length) {
  const layerAt = source.indexOf('@layer', i);
  if (layerAt === -1) {
    out += source.slice(i);
    break;
  }
  out += source.slice(i, layerAt);
  const brace = source.indexOf('{', layerAt);
  const semi = source.indexOf(';', layerAt);
  if (semi !== -1 && semi < brace) {
    i = semi + 1; // layer order statement
    continue;
  }
  const name = source.slice(layerAt + 6, brace).trim();
  const end = readBlock(source, brace);
  const body = source.slice(brace + 1, end - 1);
  if (name === 'tokens') tokens += body.replace(/:root\s*\{/g, '.kaizen-scope{');
  else if (name === 'kz-components') out += `@layer kz-components{${body}}`;
  // normalize and reset layers are dropped on purpose
  i = end;
}

// Anything left outside layers (e.g. global.css) is not needed.
const kept = out.match(/@layer kz-components\{[\s\S]*\}/)?.[0] ?? '';
writeFileSync('src/styles/kaizen.css', `${tokens}\n${kept}\n`);
console.log('Wrote src/styles/kaizen.css', (tokens.length + kept.length) / 1024 | 0, 'KB');
