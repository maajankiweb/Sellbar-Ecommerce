import fs from 'fs';
import path from 'path';

/**
 * Script to enforce Client Decision CD-08:
 * - Replace "32-Point Diagnostic Inspection" / "32-Point QC" with "Quality-checked before sale" / "Quality Inspection"
 * - Replace "Certified Data Wipe" with "Data erased before resale"
 * - Purge "NIST 800-88", "military-grade", "100% factory-level functionality"
 */

const REPLACEMENTS: [RegExp, string][] = [
  [/32-Point Rigorous Sellbar Diagnostic Check/g, 'Rigorous Hardware Diagnostic Check'],
  [/32-Point Rigorous Hardware & Battery Certification/g, 'Rigorous Hardware & Battery Certification'],
  [/Tested 32-Point Battery & Hardware Check/g, 'Tested Battery & Hardware Quality Check'],
  [/32-Point Automated Diagnostics Verified/g, 'Hardware Diagnostics Verified'],
  [/32-Point Automated Diagnostics Passed/g, 'Hardware Diagnostics Passed'],
  [/32-Point Quality Passed/g, 'Quality Checked Before Sale'],
  [/32-Point Quality Inspected/g, 'Quality Checked Before Sale'],
  [/32-Point Quality Diagnostics/g, 'Quality Inspection Diagnostics'],
  [/32-Point Quality Control Diagnostic/g, 'Quality Control Diagnostic'],
  [/32-Point Factory Diagnostic Scorecard/g, 'Hardware Diagnostic Scorecard'],
  [/32-Point Factory Diagnostic QC/g, 'Diagnostic Quality Check'],
  [/32-Point Factory Testing/g, 'Quality-Checked Before Sale'],
  [/Live 32-Point Check/g, 'Live Doorstep Inspection'],
  [/32-Point Check/g, 'Quality Check'],
  [/32-Point Inspection/g, 'Quality Inspection'],
  [/32-point inspection/g, 'quality inspection'],
  [/32-point hardware check/g, 'hardware quality check'],
  [/32-point hardware testing/g, 'hardware quality testing'],
  [/32-point QC/g, 'Quality QC'],
  [/32-point diagnostic/g, 'diagnostic inspection'],
  [/32-point technical diagnostic/g, 'technical diagnostic'],
  [/32-point quality checks/g, 'quality checks before sale'],
  [/32-Point Inspected/g, 'Quality Checked'],
  [/32-Point Audit Card/g, 'Quality Audit Card'],
  [/32-Point Diagnostic Test Report/g, 'Diagnostic Test Report'],
  [/Rigorous 32-Point Diagnostic Test/g, 'Rigorous Hardware Diagnostic Test'],
  [/Sellbar 32-Point Quality Check/g, 'Sellbar Quality Inspection'],
  [/32-Point Diagnostics & QC Fee/g, 'Quality Diagnostics & QC Fee'],
  [/32-Point Diagnostics/g, 'Quality Diagnostics'],
  [/NIST 800-88 certified data wipe/g, 'complete data erasure before resale'],
  [/NIST 800-88 sanitization/g, 'secure data sanitization'],
  [/NIST 800-88 cryptographic wiping/g, 'cryptographic data erasure before resale'],
  [/NIST 800-88 Data Wipe/g, 'Data Erased Before Resale'],
  [/NIST 800-88/g, 'Cryptographic Secure Erase'],
  [/DoD 5220\.22-M/g, 'Secure Multi-Pass Overwrite'],
  [/military-grade/g, 'durable robust'],
  [/military-standard/g, 'multi-pass'],
  [/100% factory-level functionality/g, 'full reliable operation'],
];

function sanitizeDirectory(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
      sanitizeDirectory(fullPath);
    } else if (entry.isFile() && /\.(tsx|ts|jsx|js|md|json)$/.test(entry.name)) {
      if (fullPath.includes('sanitizeClaims.ts') || fullPath.includes('checkBrandIntegrity.ts')) continue;
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const [regex, replacement] of REPLACEMENTS) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Sanitized claims in: ${fullPath}`);
      }
    }
  }
}

console.log('--- Sanitizing claims across src/ ---');
sanitizeDirectory(path.join(process.cwd(), 'src'));
console.log('--- Done sanitizing claims ---');
