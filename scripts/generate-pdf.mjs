import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const outputDir = path.resolve(__dirname, '../dist-pdf');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const targetUrl = process.argv[2] || 'http://localhost:3300';
  const outputPath = path.resolve(outputDir, 'birim-katalog-baski.pdf');

  console.log(`[PDF Engine] Tarayıcı başlatılıyor...`);
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  console.log(`[PDF Engine] Sayfa yükleniyor: ${targetUrl}`);
  
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 60000 });

  // Wait for images to load
  await page.evaluate(async () => {
    const selectors = Array.from(document.querySelectorAll('img'));
    await Promise.all(
      selectors.map((img) => {
        if (img.complete) return;
        return new Promise((resolve) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve);
        });
      })
    );
  });

  console.log(`[PDF Engine] 300 DPI A4 PDF Derleniyor...`);
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: '0mm',
      bottom: '0mm',
      left: '0mm',
      right: '0mm'
    }
  });

  await browser.close();
  console.log(`[PDF Engine] Başarılı! Dosya kaydedildi: ${outputPath}`);
}

run().catch((err) => {
  console.error('[PDF Engine Error]', err);
  process.exit(1);
});
