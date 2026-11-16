/**
 * generate-brand-assets.mjs — Génère les icônes et l'image de partage du site
 * à partir de la marque : un citron (couleur citron sur fond encre) pour les
 * icônes, le logo ruban en Anton pour l'image de partage.
 *
 *   npm run brand
 *
 * Sorties dans public/ : favicon.svg, favicon.ico, apple-touch-icon.png,
 * icon-192.png, icon-512.png, icon-maskable-512.png, og-default.jpg
 * Les fichiers générés sont commités : relancer le script seulement si la marque
 * ou la photo de couverture change.
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import opentype from 'opentype.js';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const CITRON = '#e4ff1a';
const INK = '#0a0a0a';
const FG = '#f3f3ef';
const OUT = new URL('../public/', import.meta.url);
const HERO = new URL('../src/assets/hero/hero.jpg', import.meta.url); // photo de couverture (source bureau)

const buf = fs.readFileSync(require.resolve('@fontsource/anton/files/anton-latin-400-normal.woff'));
const anton = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

/** Tracé SVG d'un texte en Anton dont la hauteur de capitale vaut `capHeight`, coin haut-gauche en (x, y). */
function textPath(text, x, y, capHeight) {
  const b = anton.getPath(text, 0, 0, 100).getBoundingBox();
  const k = capHeight / (b.y2 - b.y1);
  return {
    d: anton.getPath(text, x - b.x1 * k, y - b.y1 * k, 100 * k).toPathData(2),
    width: (b.x2 - b.x1) * k,
  };
}

// Citron dessiné à l'horizontale dans un repère 64×64, puis incliné par `iconSvg`.
const LEMON_BODY =
  'M4 32Q9 31 12 26.5C17 17.5 25 13.5 33 13.5C42 13.5 50 18.5 53.5 26.5Q56.5 31 61 32' +
  'Q56.5 33 53.5 37.5C50 45.5 42 50.5 33 50.5C25 50.5 17 46.5 12 37.5Q9 33 4 32Z';
const LEMON_LEAF = 'M50 20C50 12 55 7 62 6C63 13 59 19 50 20Z';

/** Icône carrée : citron occupant `scale` (0–1) de la tuile, coins arrondis de `radius` (sur 64). */
function iconSvg({ scale, radius = 0 }) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
    `<rect width="64" height="64" rx="${radius}" fill="${INK}"/>` +
    `<g transform="rotate(-32 32 32) translate(32 32) scale(${scale}) translate(-32 -32)">` +
    `<path d="${LEMON_BODY}" fill="${CITRON}"/>` +
    `<path d="${LEMON_LEAF}" fill="${FG}" transform="rotate(30 32 32)"/>` +
    `</g></svg>\n`
  );
}

const png = (svg, px) => sharp(Buffer.from(svg), { density: 600 }).resize(px, px).png().toBuffer();

/** Conteneur ICO minimal à charges utiles PNG. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size, 0);
    e.writeUInt8(size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

/** Image de partage 1200×630 : photo de couverture assombrie + logo ruban + accroche. */
async function ogImage() {
  const W = 1200, H = 630, M = 64;
  const cap = 64, padX = 30, padY = 20;
  const logo = textPath('ALEX DIOTTE', 0, 0, cap);
  const tapeW = logo.width + padX * 2, tapeH = cap + padY * 2;
  const tapeY = H - M - 150;
  const name = textPath('ALEX DIOTTE', M + padX, tapeY + padY, cap);
  const tag = textPath('PHOTOGRAPHE ET VIDÉASTE · MONTRÉAL', M, H - M - 34, 34);
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0.25" stop-color="${INK}" stop-opacity="0"/><stop offset="1" stop-color="${INK}" stop-opacity="0.92"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <g transform="rotate(-2 ${M} ${tapeY + tapeH})"><rect x="${M}" y="${tapeY}" width="${tapeW}" height="${tapeH}" fill="${CITRON}"/><path d="${name.d}" fill="${INK}"/></g>
    <path d="${tag.d}" fill="${FG}"/>
  </svg>`;
  return sharp(fs.readFileSync(HERO))
    .resize(W, H, { fit: 'cover', position: 'attention' })
    .composite([{ input: Buffer.from(overlay) }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

const write = (name, data) => fs.writeFileSync(new URL(name, OUT), data);
const tab = iconSvg({ scale: 0.95, radius: 12 });  // onglet de navigateur : citron le plus grand possible
const flat = iconSvg({ scale: 0.8 });              // iOS / Android (coins arrondis par l'OS)
const safe = iconSvg({ scale: 0.62 });             // maskable : contenu dans la zone sûre

write('favicon.svg', tab);
write('favicon.ico', ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(tab, size) })))));
write('apple-touch-icon.png', await png(flat, 180));
write('icon-192.png', await png(flat, 192));
write('icon-512.png', await png(flat, 512));
write('icon-maskable-512.png', await png(safe, 512));
write('og-default.jpg', await ogImage());
console.log('Icônes et image de partage générées dans public/');
