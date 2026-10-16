import { REFURB_PRODUCTS } from '../src/lib/db/data';

console.log('--- Running Product URL & Slug Smoke Test ---');

let failureCount = 0;

for (const product of REFURB_PRODUCTS) {
  if (!product.slug || typeof product.slug !== 'string') {
    console.error(`❌ Product ID ${product.id} missing valid slug.`);
    failureCount++;
    continue;
  }

  // Ensure slug format is URL-friendly
  if (!/^[a-z0-9-]+$/.test(product.slug)) {
    console.error(`❌ Product "${product.name}" has invalid slug format: "${product.slug}"`);
    failureCount++;
    continue;
  }

  // Ensure grades and pricing exist
  if (!product.grades || product.grades.length === 0) {
    console.error(`❌ Product "${product.slug}" has no condition grades configured.`);
    failureCount++;
    continue;
  }

  const topGrade = product.grades[0];
  if (!topGrade.price || topGrade.price <= 0) {
    console.error(`❌ Product "${product.slug}" has invalid price: ${topGrade.price}`);
    failureCount++;
    continue;
  }
}

if (failureCount > 0) {
  console.error(`❌ Smoke test failed with ${failureCount} errors.`);
  process.exit(1);
} else {
  console.log(`✅ PASS: Verified ${REFURB_PRODUCTS.length} catalog products with valid slugs and pricing structures.`);
  process.exit(0);
}
