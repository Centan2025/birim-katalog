import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

function saveTransformsPlugin(): Plugin {
  return {
    name: 'save-transforms-plugin',
    configureServer(server) {
      // 1. Direct save to default catalog-image-transforms.json
      server.middlewares.use('/api/save-transforms', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const targetPath = path.resolve(__dirname, './src/data/catalog-image-transforms.json');
              fs.writeFileSync(targetPath, body, 'utf8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Kaydedildi' }));
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : String(err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: message }));
            }
          });
        } else {
          res.statusCode = 404;
          res.end();
        }
      });

      // 2. Preset management endpoints
      server.middlewares.use('/api/presets', (req, res) => {
        const presetsDir = path.resolve(__dirname, './src/data/presets');
        if (!fs.existsSync(presetsDir)) {
          fs.mkdirSync(presetsDir, { recursive: true });
        }

        if (req.method === 'GET') {
          try {
            const files = fs.readdirSync(presetsDir)
              .filter(f => f.endsWith('.json'))
              .map(f => f.replace(/\.json$/, ''));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, presets: files }));
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: message }));
          }
        } else if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body) as { name?: string; data?: unknown };
              const rawName = payload.name?.trim() || 'varsayilan';
              const cleanName = rawName.replace(/[^a-zA-Z0-9_\-\u00C0-\u017F\s]/g, '').trim().replace(/\s+/g, '-');
              const presetFile = path.join(presetsDir, `${cleanName}.json`);
              const content = JSON.stringify(payload.data || {}, null, 2);

              fs.writeFileSync(presetFile, content, 'utf8');

              // Also sync to active default catalog-image-transforms.json
              const defaultFile = path.resolve(__dirname, './src/data/catalog-image-transforms.json');
              fs.writeFileSync(defaultFile, content, 'utf8');

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, name: cleanName, message: `"${cleanName}" başarıyla kaydedildi` }));
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : String(err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: message }));
            }
          });
        } else {
          res.statusCode = 404;
          res.end();
        }
      });

      // 3. Load specific preset content
      server.middlewares.use('/api/load-preset', (req, res) => {
        if (req.method === 'GET') {
          try {
            const parsedUrl = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
            const name = parsedUrl.searchParams.get('name')?.trim() || '';
            const cleanName = name.replace(/[^a-zA-Z0-9_\-\u00C0-\u017F]/g, '');
            const target = path.resolve(__dirname, `./src/data/presets/${cleanName}.json`);
            if (fs.existsSync(target)) {
              const data = fs.readFileSync(target, 'utf8');
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
            } else {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Preset bulunamadı' }));
            }
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: message }));
          }
        } else {
          res.statusCode = 404;
          res.end();
        }
      });
      // 4. Direct PDF Download with Puppeteer (No Printer Dialog)
      let sharedBrowser: any = null;
      async function getPuppeteerBrowser() {
        const puppeteer = await import('puppeteer');
        if (!sharedBrowser || !sharedBrowser.connected) {
          sharedBrowser = await puppeteer.default.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
          });
        }
        return sharedBrowser;
      }

      server.middlewares.use('/api/download-pdf', async (req, res) => {
        if (req.method === 'POST' || req.method === 'GET') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              let clientTransforms: unknown = null;
              if (body) {
                try {
                  const parsed = JSON.parse(body);
                  if (parsed && parsed.transforms) {
                    clientTransforms = parsed.transforms;
                  }
                } catch (e) {}
              }

              const parsedUrl = new URL(req.url || '', `http://${req.headers.host || 'localhost:3300'}`);
              const layout = parsedUrl.searchParams.get('layout') || 'mixed';
              const isSpread = layout === 'spread';
              const isMixed = layout === 'mixed';
              const sep = parsedUrl.search ? (parsedUrl.search.includes('?') ? '&' : '?') : '?';
              const targetUrl = `http://localhost:3300/${parsedUrl.search}${sep}puppeteer=true`;

              console.log(`[PDF Generator] Generating direct download for: ${targetUrl} (Mode: ${layout})`);
              const browser = await getPuppeteerBrowser();
              const page = await browser.newPage();

              // Inject client image zoom/move transforms into headless Chrome localStorage before scripts mount
              if (clientTransforms && typeof clientTransforms === 'object') {
                await page.evaluateOnNewDocument((transformsData) => {
                  try {
                    localStorage.setItem('birim_catalog_image_transforms', JSON.stringify(transformsData));
                  } catch (e) {}
                }, clientTransforms);
              }

              await page.setViewport({
                width: isSpread || isMixed ? 1920 : 1280,
                height: 1080
              });

              await page.goto(targetUrl, {
                waitUntil: 'networkidle0',
                timeout: 60000
              });

              // Ensure images are fully loaded
              await page.evaluate(async () => {
                const images = Array.from(document.querySelectorAll('img'));
                await Promise.all(
                  images.map((img) => {
                    if (img.complete) return;
                    return new Promise((resolve) => {
                      img.addEventListener('load', resolve);
                      img.addEventListener('error', resolve);
                    });
                  })
                );
              });

              await page.emulateMediaType('print');

              let pdfBuffer: Buffer;

              if (isMixed) {
                // In mixed layout (single A4 covers/manifesto/TOC + spread 2-page A3 product sheets),
                // Chromium has an internal shrink-to-fit bug when mixing @page sizes in a single pass.
                // We render each section at its exact native width (210mm for single, 420mm for spread)
                // and merge them using pdf-lib. This guarantees 100% full-scale rendering with zero shrinking.
                const sectionCount = await page.evaluate(() => {
                  const canvas = document.querySelector('.catalog-canvas-container');
                  return canvas ? canvas.children.length : 0;
                });

                const mergedDoc = await PDFDocument.create();

                for (let s = 0; s < sectionCount; s++) {
                  const isSpreadSection = await page.evaluate((targetIdx) => {
                    const canvas = document.querySelector('.catalog-canvas-container') as HTMLElement;
                    if (!canvas) return false;
                    const children = Array.from(canvas.children) as HTMLElement[];
                    const target = children[targetIdx];
                    if (!target) return false;
                    const isSpr = target.querySelector('.catalog-spread-row') !== null || target.classList.contains('catalog-spread-row');

                    children.forEach((c, idx) => {
                      if (idx === targetIdx) {
                        c.style.setProperty('display', 'block', 'important');
                      } else {
                        c.style.setProperty('display', 'none', 'important');
                      }
                    });

                    canvas.style.setProperty('width', isSpr ? '420mm' : '210mm', 'important');
                    canvas.style.setProperty('max-width', isSpr ? '420mm' : '210mm', 'important');
                    document.body.style.setProperty('width', isSpr ? '420mm' : '210mm', 'important');

                    let dynamicStyle = document.getElementById('puppeteer-dynamic-print-style');
                    if (!dynamicStyle) {
                      dynamicStyle = document.createElement('style');
                      dynamicStyle.id = 'puppeteer-dynamic-print-style';
                      document.head.appendChild(dynamicStyle);
                    }
                    dynamicStyle.innerHTML = `@page { size: ${isSpr ? '420mm 297mm' : '210mm 297mm'} !important; margin: 0mm !important; }`;

                    return isSpr;
                  }, s);

                  const chunkBuffer = await page.pdf({
                    width: isSpreadSection ? '420mm' : '210mm',
                    height: '297mm',
                    printBackground: true,
                    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
                  });

                  const chunkDoc = await PDFDocument.load(chunkBuffer);
                  const pageIndices = Array.from({ length: chunkDoc.getPageCount() }, (_, i) => i);
                  const copiedPages = await mergedDoc.copyPages(chunkDoc, pageIndices);
                  copiedPages.forEach(p => mergedDoc.addPage(p));
                }

                const pdfBytes = await mergedDoc.save();
                pdfBuffer = Buffer.from(pdfBytes);
              } else {
                const rawBuffer = await page.pdf({
                  width: isSpread ? '420mm' : '210mm',
                  height: '297mm',
                  format: !isSpread ? 'A4' : undefined,
                  printBackground: true,
                  preferCSSPageSize: true,
                  margin: {
                    top: '0mm',
                    bottom: '0mm',
                    left: '0mm',
                    right: '0mm'
                  }
                });
                pdfBuffer = Buffer.from(rawBuffer);
              }

              await page.close();

              const filename = `birim-katalog-${isSpread ? 'ikili-acilim' : (isMixed ? 'ekrandaki-gibi' : 'tekli-a4')}.pdf`;

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
              res.setHeader('Content-Length', pdfBuffer.length);
              res.end(pdfBuffer);
              console.log(`[PDF Generator] Direct download ready (${pdfBuffer.length} bytes)`);
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : String(err);
              console.error('[PDF Generator Error]', message);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: message }));
            }
          });
        } else {
          res.statusCode = 404;
          res.end();
        }
      });

      // 5. Sync Catalog Data from Sanity CMS
      server.middlewares.use('/api/sync-catalog-data', async (req, res) => {
        if (req.method === 'POST' || req.method === 'GET') {
          try {
            console.log('[Catalog Sync] Starting sync-catalog-data.mjs execution...');
            const { exec } = await import('child_process');
            const scriptPath = path.resolve(__dirname, './scripts/sync-catalog-data.mjs');

            exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
              if (error) {
                const errMsg = stderr || error.message;
                console.error('[Catalog Sync Error]', errMsg);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: errMsg }));
                return;
              }

              console.log('[Catalog Sync Success]', stdout);
              try {
                const jsonPath = path.resolve(__dirname, './src/data/catalog-products.json');
                const fileContent = fs.readFileSync(jsonPath, 'utf8');
                const parsed = JSON.parse(fileContent) as {
                  metadata?: {
                    total_published_products?: number;
                    total_categories?: number;
                    generated_at?: string;
                  };
                  all_products?: unknown[];
                  categories?: unknown[];
                };

                const totalProducts = parsed.metadata?.total_published_products ?? parsed.all_products?.length ?? 0;
                const totalCategories = parsed.metadata?.total_categories ?? parsed.categories?.length ?? 0;

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: true,
                  message: `Katalog verileri başarıyla güncellendi (${totalProducts} ürün, ${totalCategories} kategori).`,
                  totalProducts,
                  totalCategories,
                  generatedAt: parsed.metadata?.generated_at
                }));
              } catch {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: true,
                  message: stdout || 'Katalog verileri başarıyla güncellendi.'
                }));
              }
            });
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: message }));
          }
        } else {
          res.statusCode = 404;
          res.end();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), saveTransformsPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3300,
    open: false,
  },
});
