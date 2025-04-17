import http, { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';
import { ApiResponse, Employee, EmployeeWithoutSalary, Product, ProductResponse } from './lib/types';
import { ReqTypes } from './lib/constants';
import { fetchProducts } from './lib/fetchProducts';

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {

  const method = req.method as ReqTypes | undefined;

  if (method === ReqTypes.GET && req.url?.startsWith('/api')) {
    handleApiRoutes(req, res);
  } else if (req.method === ReqTypes.GET) {
    handleHtmlRoutes(req, res);
  } else {
    res.writeHead(405);
    res.end('Method Not Allowed');
  }
});

function handleHtmlRoutes(req: IncomingMessage, res: ServerResponse): void {
  let filePath: string = path.join(__dirname, '..', 'public', 'index.html');

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

function handleApiRoutes(req: IncomingMessage, res: ServerResponse): void {
  const filePath: string = path.join(__dirname, '..', 'public', 'data', 'employeeList.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      sendJson(res, { success: false, data: null, error: 'Internal Server Error' }, 500);
      return;
    }

    try {
      const parsedList: Employee[] = JSON.parse(data);

      switch (req.url) {
        case '/api/employeeList':
          return handleEmployeeList(res, parsedList);

        case '/api/oldestEmployee':
          return handleOldestEmployee(res, parsedList);

        case '/api/averageSalary':
          return handleAverageSalary(res, parsedList);

        case '/api/top100products':
          return handleTop100Products(res);

        default:
          sendJson(res, { success: false, data: null, error: 'API endpoint not found' }, 404);
      }
    } catch (parseError) {
      sendJson(res, { success: false, data: null, error: 'Internal Server Error' }, 500);
    }
  });
}

function handleEmployeeList(res: ServerResponse, parsedList: Employee[]): void {
  const employeesWithoutSalary: EmployeeWithoutSalary[] = parsedList.map(({ maas, ...rest }) => rest);

  const response: ApiResponse<EmployeeWithoutSalary[]> = {
    success: true,
    data: employeesWithoutSalary
  };

  sendJson(res, response);
}

function handleOldestEmployee(res: ServerResponse, parsedList: Employee[]): void {
  const oldestEmployee: Employee = parsedList.reduce((oldest, current) =>
    new Date(oldest.ise_giris_tarihi) < new Date(current.ise_giris_tarihi) ? oldest : current
  );
  const response: ApiResponse<Employee> = {
    success: true,
    data: oldestEmployee
  };
  sendJson(res, response);
}

function handleAverageSalary(res: ServerResponse, parsedList: Employee[]): void {
  const totalSalary: number = parsedList.reduce((sum, { maas }) => sum + maas, 0);
  const averageSalary: number = totalSalary / parsedList.length;

  const response: ApiResponse<{ averageSalary: number }> = {
    success: true,
    data: { averageSalary }
  };
  sendJson(res, response);
}

function handleTop100Products(res: ServerResponse): void {

  fetchProducts()
    .then((allProducts) => {
      const response: ProductResponse = {
        success: true,
        data: allProducts
      };
      sendJson<Product[]>(res, response);
    })
    .catch((error: unknown) => {
      const errMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorResponse: ProductResponse = {
        success: false,
        error: `Product fetch failed: ${errMessage}`
      };
      sendJson(res, errorResponse, 500);
    });
}

function sendJson<T>(res: ServerResponse, data: ApiResponse<T>, statusCode: number = 200): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const PORT: number = 3000;
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
