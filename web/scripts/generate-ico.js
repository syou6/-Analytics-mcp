const pngToIco = require('png-to-ico');
const fs = require('fs');
const path = require('path');

async function generateIco() {
  const publicDir = path.join(__dirname, '../public');
  
  // Read PNG files
  const pngFiles = [
    path.join(publicDir, 'favicon-16x16.png'),
    path.join(publicDir, 'favicon-32x32.png'),
    path.join(publicDir, 'favicon-48x48.png'),
  ];
  
  const buffers = pngFiles.map(file => fs.readFileSync(file));
  
  // Generate ICO
  const ico = await pngToIco(buffers);
  
  // Write ICO file
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);
  console.log('Generated favicon.ico successfully!');
}

generateIco().catch(console.error);