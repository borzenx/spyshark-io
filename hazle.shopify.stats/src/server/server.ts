import * as express from 'express';
import traffic from './api/traffic';
import tiktok from './api/tiktok';
import tiktokVirals from './api/tiktok_virals'
import * as path from 'path'; // Import the 'path' module

const app = express();

app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && req.hostname !== 'localhost') {
    res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
  } else {
    next();
  }
});

app.use(traffic);
app.use(tiktok);
app.use(tiktokVirals);

app.use(express.static(path.join(__dirname, '../public')));

// Handle client-side routing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.get('/sales-tracker', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.get('/sales-tracker/store', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.get('/tiktok-virals', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
  app.get('*', (req, res) => {
    res.json('404 DEBILU NIE MA TAKIEJ STRONY, WEZ SPIERDALAJ');
  });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port: ${port}`));
