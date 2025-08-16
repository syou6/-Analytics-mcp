const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  const svgPath = path.join(__dirname, '../public/orb-icon.svg');
  const publicDir = path.join(__dirname, '../public');
  
  // Generate PNG versions
  const sizes = [16, 32, 48, 64, 128, 256];
  
  for (const size of sizes) {
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, `favicon-${size}x${size}.png`));
    console.log(`Generated favicon-${size}x${size}.png`);
  }
  
  // Generate main favicon.png (32x32)
  await sharp(svgPath)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Generated favicon.png');
  
  // Generate apple-touch-icon
  await sharp(svgPath)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');
  
  // Note: For .ico file, we need a different approach
  // Most browsers now support PNG favicons, so favicon.png should work
  console.log('\nFavicon generation complete!');
  console.log('Note: favicon.ico needs to be generated separately using an online tool or specialized software');
}

generateFavicons().catch(console.error);