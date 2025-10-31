# Task Tracker with Smart Insights

A simple full-stack web app to manage daily tasks and get a quick summary of how busy your week looks.  
Built using **Node.js (Express)** for the backend and **React** for the frontend.

---

## 🚀 Features
- Add new tasks with title, description, priority, due date, and status.
- View and filter tasks by priority or status.
- Update task status or priority.
- Basic “Insights” summary showing:
  - Total tasks
  - Count by priority
  - Number of due-soon tasks (within 3 days)

---

## 🧱 Tech Stack
**Backend:** Node.js, Express, SQLite (via Knex)  
**Frontend:** React + Fetch API  
**Database:** SQLite (lightweight and file-based)  

---

## 🧩 API Endpoints
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/tasks` | Create a new task |
| `GET` | `/tasks` | Get all tasks (supports filters) |
| `PATCH` | `/tasks/:id` | Update a task’s status or priority |
| `GET` | `/insights` | Returns computed insights |

---

## ⚙️ Setup Instructions

### Backend
```bash
cd backend
npm install
npm start
