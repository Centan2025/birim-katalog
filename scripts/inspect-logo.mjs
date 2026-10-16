import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const fileData = fs.readFileSync('public/logo-black.png');
  const base64 = fileData.toString('base64');
  await page.setContent(`<img id="logo" src="data:image/png;base64,${base64}">`);
  
  const rect = await page.evaluate(async () => {
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
        if (a > 10) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    return { minX, minY, maxX, maxY, width: canvas.width, height: canvas.height };
  });

  console.log('Logo bbox:', JSON.stringify(rect, null, 2));
  await browser.close();
}

run();
