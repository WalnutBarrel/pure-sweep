const Jimp = require('jimp');

async function processImage() {
  const image = await Jimp.read('./public/images/logo-primary.jpg');
  
  // Convert image to RGBA if it isn't already
  image.rgba(true);
  
  // Get the background color from the top-left pixel
  const targetColor = image.getPixelColor(0, 0);
  
  // We'll define a tolerance for the background color since JPGs have compression artifacts
  const distance = (c1, c2) => {
    const r1 = (c1 >> 24) & 255;
    const g1 = (c1 >> 16) & 255;
    const b1 = (c1 >> 8) & 255;
    const r2 = (c2 >> 24) & 255;
    const g2 = (c2 >> 16) & 255;
    const b2 = (c2 >> 8) & 255;
    return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2));
  };
  
  // Scan all pixels
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const color = image.getPixelColor(x, y);
    if (distance(color, targetColor) < 25) { // 25 is the tolerance
      // Set alpha to 0 for background pixels
      this.bitmap.data[idx + 3] = 0;
    }
  });
  
  // Autocrop the transparent edges
  image.autocrop();
  
  // Resize to a standard favicon size for Next.js app/icon.png (e.g. 512x512)
  image.resize(512, 512);
  
  // Save as PNG
  await image.writeAsync('./src/app/icon.png');
  console.log('Saved transparent icon to ./src/app/icon.png');
}

processImage().catch(console.error);
