const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  switch (req.url) {
    case '/employeeList':
    case '/oldestEmployee':
    case '/averageSalary':
      handleApiRoutes(req, res);
      break;

    default:
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

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
      return;
    }

    try {
      const parsedList = JSON.parse(data);

      switch (req.url) {
        case '/employeeList':
          return handleEmployeeList(res, parsedList);

        case '/oldestEmployee':
          return handleOldestEmployee(res, parsedList);

        case '/averageSalary':
          return handleAverageSalary(res, parsedList);

        default:
          res.writeHead(404);
          res.end(JSON.stringify({ error: 'API endpoint not found' }));
      }
    } catch (parseError) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Invalid JSON format' }));
    }
  });
}

function handleEmployeeList(res, parsedList) {
  const employeesWithoutSalary = parsedList.map(({ maas, ...rest }) => rest);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(employeesWithoutSalary));
}

function handleOldestEmployee(res, parsedList) {
  const oldest = parsedList.reduce((a, b) =>
    new Date(a.ise_giris_tarihi) < new Date(b.ise_giris_tarihi) ? a : b
  );
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(oldest));
}

function handleAverageSalary(res, parsedList) {
  const totalSalary = parsedList.reduce((sum, { maas }) => sum + maas, 0);
  const averageSalary = (totalSalary / parsedList.length).toFixed(2);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ averageSalary }));
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
