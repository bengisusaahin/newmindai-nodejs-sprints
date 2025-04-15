import http, { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';
import { ApiResponse, Employee } from './lib/types';

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
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

function handleHtmlRoutes(req: IncomingMessage, res: ServerResponse) : void {
  let filePath = path.join(__dirname, '..', 'public', 'index.html');

  if (req.url === '/products') {
    filePath = path.join(__dirname, '..', 'public', 'products.html');
  } else if (req.url === '/contact') {
    filePath = path.join(__dirname, '..', 'public', 'contact.html');
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

function handleApiRoutes(req: IncomingMessage, res: ServerResponse) : void {
  const filePath = path.join(__dirname, '..', 'public', 'data', 'employeeList.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      sendJson(res, { success: false, data: null, error: 'Internal Server Error' }, 500);
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
          sendJson(res, { success: false, data: null, error: 'API endpoint not found' }, 404);
      }
    } catch (parseError) {
      sendJson(res, { success: false, data: null, error: 'API endpoint not found' }, 500);
    }
  });
}

function handleEmployeeList(res: ServerResponse, parsedList:Employee[]): void {
  const employeesWithoutSalary = parsedList.map(({ maas, ...rest }) => rest);

  const response: ApiResponse<Omit<Employee, 'maas'>[]> = {
    success: true,
    data: employeesWithoutSalary,
  };

  sendJson(res, response);
}

function handleOldestEmployee(res: ServerResponse, parsedList: Employee[]) : void {
  const oldestEmployee = parsedList.reduce((oldest, current) =>
    new Date(oldest.ise_giris_tarihi) < new Date(current.ise_giris_tarihi) ? oldest : current
  );
  const response: ApiResponse<Employee> = {
    success: true,
    data: oldestEmployee,
  };
  sendJson(res, response);
}

function handleAverageSalary(res: ServerResponse, parsedList: Employee[]) : void {
  const totalSalary = parsedList.reduce((sum, { maas }) => sum + maas, 0);
  const averageSalary = Number((totalSalary / parsedList.length).toFixed(2));

  const response: ApiResponse<{average: number}> = {
    success: true,
    data: { average: averageSalary },
  };
  sendJson(res, response); 
}

function sendJson<T>(res: ServerResponse, data: ApiResponse<T>, statusCode: number = 200) : void{
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const PORT = 3000;
const open = (url: string, options?: object) => import('open').then((m) => m.default(url, options));

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
