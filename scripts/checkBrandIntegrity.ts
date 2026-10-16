import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const TARGET_DIRS = ['src', 'public', 'docs'];
const TARGET_FILES = ['README.md', 'capacitor.config.ts', 'next.config.ts', 'package.json'];

// Single permitted exception according to prompt Section 4 item 12:
// The only permitted legacy string is the old SELBAR_MASTER_API_KEY name inside docs/SECURITY_ROTATION.md
const PERMITTED_EXCEPTIONS = [
  {
    fileMatch: 'docs/SECURITY_ROTATION.md',
    allowedString: 'SELBAR_MASTER_API_KEY',
  },
];

interface Violation {
  file: string;
  line: number;
  match: string;
  preview: string;
}

const violations: Violation[] = [];

// Regex to capture forbidden forms: SELBAR, Selbar, or selbar.in
const FORBIDDEN_REGEX = /\b(SELBAR|Selbar|selbar\.in)\b/g;

function checkFile(filePath: string) {
  const relPath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((lineText, idx) => {
    let cleanLine = lineText;

    // Filter out permitted exceptions
    for (const exc of PERMITTED_EXCEPTIONS) {
      if (relPath.includes(exc.fileMatch)) {
        cleanLine = cleanLine.split(exc.allowedString).join('___ALLOWED___');
      }
    }

    const matches = cleanLine.match(FORBIDDEN_REGEX);
    if (matches) {
      for (const m of matches) {
        violations.push({
          file: relPath,
          line: idx + 1,
          match: m,
          preview: lineText.trim().substring(0, 80),
        });
      }
    }
  });
}

function traverse(dirPath: string) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', '.next', '.gemini'].includes(entry.name)) {
        traverse(full);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.html', '.css', '.sh', '.svg', '.webmanifest'].includes(ext)) {
        checkFile(full);
      }
    }
  }
}

console.log('--- Running CI Brand Integrity Check (Strict Sellbar / sellbar.in) ---');

for (const dir of TARGET_DIRS) {
  const p = path.join(ROOT_DIR, dir);
  if (fs.existsSync(p)) traverse(p);
}

for (const file of TARGET_FILES) {
  const p = path.join(ROOT_DIR, file);
  if (fs.existsSync(p)) checkFile(p);
}

if (violations.length > 0) {
  console.error(`❌ Found ${violations.length} brand integrity violations:\n`);
  for (const v of violations.slice(0, 20)) {
    console.error(`  [${v.file}:${v.line}] Match "${v.match}": ${v.preview}`);
  }
  if (violations.length > 20) {
    console.error(`  ...and ${violations.length - 20} more violations.`);
  }
  process.exit(1);
} else {
  console.log('✅ PASS: Zero brand integrity violations found across src/, public/, docs/, and README.md.');
  process.exit(0);
}
