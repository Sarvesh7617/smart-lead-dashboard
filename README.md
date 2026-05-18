# 📌 Smart Leads Dashboard

A full-stack **MERN CRM Dashboard** with authentication, RBAC, filtering, pagination, and CSV export.

---

##ScreenShots

<img width="1919" height="965" alt="Screenshot 2026-05-19 032323" src="https://github.com/user-attachments/assets/5823fdc1-1923-4df4-8b8e-7bf962aa09be" />

---

<img width="1919" height="958" alt="Screenshot 2026-05-19 032337" src="https://github.com/user-attachments/assets/33289385-490d-4599-8a6d-ede5df3eeaea" />

---

## 🚀 Features

### 🔐 Authentication
- JWT-based login system (cookie-based auth)
- Protected routes (frontend + backend)
- Auto login on refresh (`/users/current-user`)
- Logout functionality

---

### 👥 Role-Based Access Control (RBAC)
- **Admin**
  - Add leads
  - Edit/Delete leads (optional)
- **Sales**
  - View leads only

---

### 📊 Leads Management
- Create & view leads
- Pagination (server-side)
- Search + filters (status, source)
- Debounced search

---

### 📁 Export Feature
- Export leads data as **CSV**

---

### 🎨 UI Features
- Responsive dashboard
- Loading states
- Empty states
- Clean table UI

---

## 🏗️ Tech Stack

### Frontend
- React + TypeScript
- Axios
- Context API
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cookie Parser
- json2csv

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
  git clone https://github.com/Sarvesh7617/smart-lead-dashboard.git
```

## 📦 Backend Setup

### 2. Navigate to backend project directory


```bash
  cd backend
```

### 3. Install dependencies
```bash
  npm install
```

### 4. 🔐 Environment Variables

#### Create a .env file in the root of your project and add your Appwrite credentials:

```bash
  PORT=5000
  MONGO_URI=your_mongodb_uri
  ACCESS_TOKEN_SECRET=your_secret
  REFRESH_TOKEN_SECRET=your_secret
```

### 5. Run development server

#### Run manually in two terminals

```bash
  Terminal 1 (TypeScript Watch Mode)
  npm run dev
```
```bash
  Terminal 2 (Start Server)
  npm start
```

---

## 📦 Frontend Setup

### 2. Navigate to backend project directory


```bash
  cd frontend
```

### 3. Install dependencies
```bash
  npm install
```

### 4. 🔐 Environment Variables

#### Create a .env file in the root of your project and add your Appwrite credentials:

```bash
  VITE_BACKEND_URL="http://your_backend_localhost/api/v1"
  BACKEND_URL="http://your_backend_localhost"
```

### 5. Run development server

```bash
  npm run dev
```

---


## 🔗 Live Website

👉 [Click here to visit project](https://video-tube-sigma.vercel.app/)


# Auth Flow

- User logs in
- Backend sends HTTP-only cookie (accessToken)
- Frontend calls /users/current-user on refresh
- If valid → user stays logged in
- If invalid → redirect to login



# API Endpoints

### Auth

```bash
  POST /users/register
  POST /users/login
  POST /users/logout
  GET  /users/current-user
```

### Leads

```bash
  GET    /leads
  POST   /leads
  GET    /leads/export/csv
```
