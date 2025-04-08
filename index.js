const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'public', 'index.html');

  if (req.url === '/products') {
    filePath = path.join(__dirname, 'public', 'products.html');
  } else if (req.url === '/contact') {
    filePath = path.join(__dirname, 'public', 'contact.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Sayfa bulunamadı');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
});

const PORT = 3000;
const open = (...args) => import('open').then(m => m.default(...args));

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  open(`http://localhost:${PORT}`)
    .then(() => {
      console.log('Browser opened.');
    })
    .catch((err) => {
      console.error('Browser can not open:', err);
    });
});
