# Node.js Sprint 2 Project – Basic HTTP Server

This project is part of the **NewMindAi Node.js Sprints**. It was built using **TypeScript**, **Node.js HTTP module**, and follows **modular, clean code principles** with semantic commits. It serves static HTML pages and provides several API endpoints powered by JSON data.

---

## 🚀 Features

- Built with pure Node.js (no frameworks)
- Serves static HTML pages (`index`, `products`, `contact`)
- API endpoints using local JSON file (`employeeList.json`)
- Modular and clean route handling
- Auto-opens browser on server start (`open` module)
- Implements **Atomic Commits** with **Semantic Commit Messages**

---

## 🔧 Installation

```bash
npm install
npm run dev
```

> Make sure you have nodemon installed globally or as a dev dependency.

---

## 🐳 Run with Docker
```bash
# Build and run container
docker compose up --build

# or simply
npm run docker
```
> This will mount the current directory as a volume for hot reload using `nodemon`.

## 🌦️ Environment Variables
Make sure to create a `.env` file:
```
WEATHER_API_KEY=your_openweather_api_key
```

## 🔗 Available Endpoints
- `/` → Home
- `/products` → Products Page
- `/contact` → Contact Page
- `/api/employeeList` → Employee list without salaries
- `/api/oldestEmployee` → Employee with earliest start date
- `/api/averageSalary` → Average salary
- `/api/top100products` → Top-rated 100 products
- `/api/how-is-your-weather` → Weather info based on IP


## ✅ Sprint Summary
- [x] TypeScript migration
- [x] Modular API and HTML routing
- [x] Reusable and centralized types
- [x] External API integrations (products + weather)
- [x] Docker support with `.env` usage
- [x] Volume mount for hot reload in development

##  Commit Strategy

This project follows:

- **Atomic Commits**  
  Each commit introduces a single, meaningful change.

- **Semantic Commit Messages**  
  Examples used in this project:
  - `feat: add /oldestEmployee API endpoint`
  - `refactor: modularize API route handling`
  - `fix: handle invalid JSON gracefully`

> This strategy improves collaboration, code review, and readability of the project history.
## Contact

<table style="border-collapse: collapse; width: 100%;">
  <tr>
    <td style="padding-right: 10px;">Bengisu Şahin - <a href="mailto:bengisusaahin@gmail.com">bengisusaahin@gmail.com</a></td>
    <td>
      <a href="https://www.linkedin.com/in/bengisu-sahin/" target="_blank">
        <img src="https://img.shields.io/badge/linkedin-%231E77B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white" alt="linkedin" style="vertical-align: middle;" />
      </a>
    </td>
  </tr>
</table>
