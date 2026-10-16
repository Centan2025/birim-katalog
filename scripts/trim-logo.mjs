import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function trimLogo(inputPath, outputPath) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const fileData = fs.readFileSync(inputPath);
  const base64 = fileData.toString('base64');
  await page.setContent(`<img id="logo" src="data:image/png;base64,${base64}">`);
  
  const croppedDataUrl = await page.evaluate(async () => {
    const img = document.getElementById('logo');
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const a = data[(y * canvas.width + x) * 4 + 3];
        if (a > 15) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    
    const cropW = maxX - minX + 1;
    const cropH = maxY - minY + 1;
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = cropW;
    cropCanvas.height = cropH;
    const cropCtx = cropCanvas.getContext('2d');
    cropCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
    return {
      dataUrl: cropCanvas.toDataURL('image/png'),
      original: { w: canvas.width, h: canvas.height },
      crop: { minX, minY, cropW, cropH }
    };
  });

  const base64Data = croppedDataUrl.dataUrl.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(outputPath, Buffer.from(base64Data, 'base64'));
  console.log(`Trimmed ${inputPath} -> ${outputPath}:`, croppedDataUrl.crop);
  await browser.close();
}

async function main() {
  // Backup originals
  if (!fs.existsSync('public/logo-black-orig.png')) {
    fs.copyFileSync('public/logo-black.png', 'public/logo-black-orig.png');
  }
  if (!fs.existsSync('public/logo-white-orig.png')) {
    fs.copyFileSync('public/logo.png', 'public/logo-white-orig.png');
  }

  await trimLogo('public/logo-black-orig.png', 'public/logo-black.png');
  await trimLogo('public/logo-white-orig.png', 'public/logo.png');
}

main();
