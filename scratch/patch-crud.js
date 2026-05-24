const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../src/actions/crud.ts');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Add import statement if it doesn't exist
if (!content.includes('import { requireAdmin } from "@/lib/auth-utils"')) {
  content = content.replace(
    'import { revalidatePath } from "next/cache";',
    'import { revalidatePath } from "next/cache";\nimport { requireAdmin } from "@/lib/auth-utils";'
  );
}

// 2. Inject await requireAdmin(); at the start of every exported async function
// Pattern to match: export async function functionName(args) {
const functionRegex = /export async function ([a-zA-Z0-9_]+)\([^)]*\)\s*(?::\s*[^{]+)?\s*\{/g;

content = content.replace(functionRegex, (match, p1) => {
  // If it already has requireAdmin inside, don't add it again
  return `${match}\n  await requireAdmin();\n`;
});

// Since we run global replace, we just need to ensure we don't double inject
// We'll clean up any double injections just in case
content = content.replace(/await requireAdmin\(\);\s+await requireAdmin\(\);/g, 'await requireAdmin();');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Patch complete.');
