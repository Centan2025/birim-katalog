import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

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
