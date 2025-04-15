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
      sendJson(res, { error: 'Internal Server Error' }, 500);
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
          sendJson(res, { error: 'API endpoint not found' }, 404);
      }
    } catch (parseError) {
      sendJson(res, { error: 'Invalid JSON format' }, 500);
    }
  });
}

function handleEmployeeList(res, parsedList) {
  const employeesWithoutSalary = parsedList.map(({ maas, ...rest }) => rest);
  sendJson(res, employeesWithoutSalary);
}

function handleOldestEmployee(res, parsedList) {
  const oldestEmployee = parsedList.reduce((oldest, current) =>
    new Date(oldest.ise_giris_tarihi) < new Date(current.ise_giris_tarihi) ? oldest : current
  );
  sendJson(res, oldestEmployee);
}

function handleAverageSalary(res, parsedList) {
  const totalSalary = parsedList.reduce((sum, { maas }) => sum + maas, 0);
  const averageSalary = (totalSalary / parsedList.length).toFixed(2);
  sendJson(res, { averageSalary }); 
}

function sendJson(res, data, statusCode = 200) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
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
