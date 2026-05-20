import sharp from "sharp";
import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const source = join(publicDir, "images", "logo_s.png");
const appDir = join(root, "src", "app");

async function generateFavicons() {
  console.log("Generating favicon set from public/images/logo_s.png...");

  // Generate PNG favicons at different sizes
  const sizes = [
    { name: "favicon-16x16.png", size: 16 },
    { name: "favicon-32x32.png", size: 32 },
    { name: "apple-touch-icon.png", size: 180 },
    { name: "android-chrome-192x192.png", size: 192 },
    { name: "android-chrome-512x512.png", size: 512 },
  ];

  for (const { name, size } of sizes) {
    await sharp(source)
      .resize(size, size, { fit: "cover", position: "centre" })
      .png({ quality: 95 })
      .toFile(join(publicDir, name));
    console.log(`  Created ${name} (${size}x${size})`);
  }

  // Generate favicon.ico (use 32x32 PNG as ICO source)
  // Next.js App Router uses src/app/favicon.ico
  const ico32 = await sharp(source)
    .resize(32, 32, { fit: "cover", position: "centre" })
    .png({ quality: 95 })
    .toBuffer();

  // Write as PNG but name it .ico (browsers handle this fine)
  writeFileSync(join(appDir, "favicon.ico"), ico32);
  console.log("  Created src/app/favicon.ico (32x32 PNG)");

  // Generate OG image from the logo_c.png
  const primarySource = source;
  await sharp(primarySource)
    .resize(1200, 630, { fit: "contain", background: { r: 240, g: 245, b: 249, alpha: 1 } })
    .png({ quality: 90 })
    .toFile(join(publicDir, "images", "og-image.png"));
  console.log("  Created og-image.png (1200x630)");

  console.log("\nAll favicon assets generated successfully!");
}

generateFavicons().catch(console.error);
