# Employee Management System

This is an employee management system built with a MERN stack:
- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React, Vite, Tailwind CSS

## 🚀 Features

- User registration and login
- Role-based access control
- Employee and project management
- Task tracking and assignment

---

## 📁 Project Structure

### Backend

```
Backend/
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc
├── package-lock.json
├── package.json
├── vercel.json
└── src/
    ├── Db/
    ├── app.js
    ├── constant.js
    ├── controller/
    ├── middleware/
    ├── model/
    ├── routes/
    ├── util/
    └── validation/
```

### Frontend

```
Frontend/
├── .env
├── .env.example
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── public/
├── vercel.json
├── vite.config.js
└── src/
    ├── App.css
    ├── App.jsx
    ├── main.jsx
    ├── RoleBase/
    ├── common/
    ├── context/
    ├── layouts/
    └── pages/
```

---

## 🛠️ Getting Started

Follow the steps below to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd employee-management-system
```

### 2. Setup Backend

```bash
cd Backend
npm install
cp .env.example .env    # Add environment variables
npm run dev
```

### 3. Setup Frontend

```bash
cd ../Frontend
npm install
cp .env.example .env    # Add environment variables
npm run dev
```

---

## 📦 Installation Summary

| Directory | Command          |
|----------|------------------|
| Backend  | `npm install`    |
| Frontend | `npm install`    |

## ▶️ Running the Project

| Directory | Command        |
|----------|----------------|
| Backend  | `npm run dev`  |
| Frontend | `npm run dev`  |

---

## 📄 License

This project is licensed for educational and development use.
