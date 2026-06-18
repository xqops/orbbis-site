import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Serve static assets (CSS, JS, images, fonts) but NOT .html directly
app.use(express.static(__dirname, { extensions: [] }));

// Redirect .html URLs to clean URLs
app.get('/index.html',   (req, res) => res.redirect(301, '/'));
app.get('/editor.html',  (req, res) => res.redirect(301, '/editor'));
app.get('/docs.html',    (req, res) => res.redirect(301, '/docs'));
app.get('/privacy.html', (req, res) => res.redirect(301, '/privacy'));

// Clean URL routes
app.get('/',        (req, res) => res.sendFile(join(__dirname, 'index.html')));
app.get('/editor',  (req, res) => res.sendFile(join(__dirname, 'editor.html')));
app.get('/docs',    (req, res) => res.sendFile(join(__dirname, 'docs.html')));
app.get('/privacy', (req, res) => res.sendFile(join(__dirname, 'privacy.html')));

app.listen(port, '0.0.0.0', () => {
  console.log(`Orbbis server running on port ${port}`);
});
