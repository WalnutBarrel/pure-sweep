const Jimp = require('jimp');

async function processImage() {
  const imagePath = './public/images/logo_transparent.png';
  const image = await Jimp.read(imagePath);
  
  // Convert image to RGBA if it isn't already
  image.rgba(true);
  
  // Get the background color from the top-left pixel
  const targetColor = image.getPixelColor(0, 0);
  
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
    // Tolerance for black background removal
    if (distance(color, targetColor) < 25) { 
      // Set alpha to 0 for background pixels
      this.bitmap.data[idx + 3] = 0;
    }
  });
  
  // Save as PNG, overwriting the file
  await image.writeAsync('./public/images/logo_transparent.png');
  console.log('Removed black background and saved to ./public/images/logo_transparent.png');
}

processImage().catch(console.error);
