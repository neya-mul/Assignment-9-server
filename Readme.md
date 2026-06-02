# 🐾 Pet Adoption Platform — Server

Backend REST API for the Pet Adoption Platform built with **Node.js**, **Express**, and **MongoDB**.

---

## ✨ Features

- Full CRUD operations for pet listings
- Adoption request system with duplicate prevention
- Auto-marks pet as adopted when a request is approved
- JWT verification middleware using remote JWKS endpoint
- Search by name (`$regex`) and filter by species (`$in`)

---

## 📦 NPM Packages Used

| Package | Purpose |
|---|---|
| `express` | Web server framework |
| `mongodb` | Database |
| `dotenv` | Environment variables |
| `cors` | Cross-Origin Resource Sharing |
| `jose-cjs` | JWT verification |

---

## ⚙️ Environment Variables

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

---

## 🚀 Run Locally

```bash
npm install
npm start
```