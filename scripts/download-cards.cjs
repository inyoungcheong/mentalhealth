// Download 78 tarot card images from searge/tarot GitHub repo
const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE = 'https://raw.githubusercontent.com/searge/tarot/master/assets/img/big';
const OUT = path.join(__dirname, '../public/cards');

fs.mkdirSync(OUT, { recursive: true });

function download(filename) {
  return new Promise((resolve, reject) => {
    const dest = path.join(OUT, filename);
    if (fs.existsSync(dest)) { process.stdout.write(`  skip ${filename}\n`); resolve(); return; }
    const file = fs.createWriteStream(dest);
    https.get(`${BASE}/${filename}`, res => {
      if (res.statusCode !== 200) { file.close(); fs.unlinkSync(dest); reject(new Error(`${filename}: ${res.statusCode}`)); return; }
      res.pipe(file);
      file.on('finish', () => { file.close(); process.stdout.write(`  ✓ ${filename}\n`); resolve(); });
    }).on('error', reject);
  });
}

async function main() {
  const files = [];
  for (let i = 0; i <= 21; i++) files.push(`maj${String(i).padStart(2,'0')}.jpg`);
  for (const suit of ['cups', 'pents', 'swords', 'wands']) {
    for (let i = 1; i <= 14; i++) files.push(`${suit}${String(i).padStart(2,'0')}.jpg`);
  }

  console.log(`Downloading ${files.length} card images to public/cards/...\n`);
  for (const f of files) {
    await download(f).catch(err => console.error(`  ✗ ${err.message}`));
  }
  console.log(`\nDone.`);
}

main();
