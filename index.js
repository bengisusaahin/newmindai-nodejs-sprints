const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/employee')) {
    handleApiRoutes(req, res);
  } else {
    handleHtmlRoutes(req, res);
  }
});

function handleHtmlRoutes(req, res) {
  let filePath = path.join(__dirname, 'public', 'index.html');

  if (req.url === '/products') {
    filePath = path.join(__dirname, 'public', 'products.html');
  } else if (req.url === '/contact') {
    filePath = path.join(__dirname, 'public', 'contact.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Page not found');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
}

function handleApiRoutes(req, res) {
  const filePath = path.join(__dirname, 'data', 'employeeList.json');

  if (req.url === '/employeeList') {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        return;
      }

      try {
        const parsedList = JSON.parse(data);
        const employeesWithoutSalary = parsedList.map(({ maas, ...rest }) => rest);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(employeesWithoutSalary));
      } catch (parseError) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Invalid JSON format' }));
      }
    });
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'API endpoint not found' }));
  }
}

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
