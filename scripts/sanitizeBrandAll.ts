import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const TARGET_DIRS = ['src', 'public', 'docs'];
const TARGET_FILES = ['README.md', 'capacitor.config.ts', 'next.config.ts', 'package.json'];

function processFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updated = content;

  // If this is docs/SECURITY_ROTATION.md, temporarily mask SELBAR_MASTER_API_KEY
  const isSecurityRotation = filePath.endsWith('docs/SECURITY_ROTATION.md') || filePath.endsWith('docs\\SECURITY_ROTATION.md');
  const MASK = '___LEGACY_SELBAR_MASTER_API_KEY___';

  if (isSecurityRotation) {
    updated = updated.replace(/SELBAR_MASTER_API_KEY/g, MASK);
  }

  // Exact domain and email replacements first
  updated = updated.replace(/admin@selbar\.in/g, 'admin@sellbar.in');
  updated = updated.replace(/support@selbar\.in/g, 'support@sellbar.in');
  updated = updated.replace(/support@selbar\.com/g, 'support@sellbar.in');
  updated = updated.replace(/auth@selbar\.in/g, 'auth@sellbar.in');
  updated = updated.replace(/api\.selbar\.in/g, 'api.sellbar.in');
  updated = updated.replace(/admin\.selbar\.in/g, 'admin.sellbar.in');
  updated = updated.replace(/https:\/\/selbar\.in/g, 'https://sellbar.in');
  updated = updated.replace(/http:\/\/selbar\.in/g, 'http://sellbar.in');
  updated = updated.replace(/selbar\.in/g, 'sellbar.in');

  // Exact uppercase SELBAR
  updated = updated.replace(/SELBAR/g, 'Sellbar');

  // Exact mixed case Selbar
  updated = updated.replace(/Selbar/g, 'Sellbar');

  // Common queue / storage / key prefixes
  updated = updated.replace(/selbar-/g, 'sellbar-');
  updated = updated.replace(/selbar_/g, 'sellbar_');

  if (isSecurityRotation) {
    updated = updated.replace(new RegExp(MASK, 'g'), 'SELBAR_MASTER_API_KEY');
  }

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated: ${path.relative(ROOT_DIR, filePath)}`);
  }
}

function traverseDirectory(dirPath: string) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== '.next') {
        traverseDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.html', '.css', '.sh', '.svg', '.webmanifest'].includes(ext)) {
        processFile(fullPath);
      }
    }
  }
}

console.log('--- Starting Brand Sanitization to "Sellbar" & "sellbar.in" ---');

for (const targetDir of TARGET_DIRS) {
  const fullDirPath = path.join(ROOT_DIR, targetDir);
  if (fs.existsSync(fullDirPath)) {
    traverseDirectory(fullDirPath);
  }
}

for (const targetFile of TARGET_FILES) {
  const fullFilePath = path.join(ROOT_DIR, targetFile);
  if (fs.existsSync(fullFilePath)) {
    processFile(fullFilePath);
  }
}

console.log('--- Brand Sanitization Completed ---');
