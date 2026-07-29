# Bloomora — Full Stack E-Commerce (Botanical Skincare)

## 🚀 Quick Start (beginner-friendly)

If you're new to this, follow these steps **in order**. You need [Node.js](https://nodejs.org) installed first (version 18 or higher) — download and install it, then restart your computer.

You will open **3 separate terminal/command prompt windows** — one for each app (backend, frontend, admin). Keep all 3 running at the same time.

**Terminal 1 — Backend (the API/database):**
```bash
cd backend
npm install
npm run seed
npm start
```
Leave this running. It powers both websites below.

**Terminal 2 — Customer website:**
```bash
cd frontend
npm install
npm run dev
```
Open the link it prints (usually `http://localhost:5173`) in your browser — this is the shop customers see.

**Terminal 3 — Admin panel:**
```bash
cd admin
npm install
npm run dev
```
Open the link it prints (usually `http://localhost:5174`) — this is where you manage products/orders.
Login with: `admin@bloomora.pk` / `Admin@123`

That's it — you now have the full project running locally. See section 3 below for more detail.

---

A complete e-commerce project for a fictional Karachi-based skincare/cosmetics
brand called **Bloomora**. The brand's signature idea: every product page
shows a "formulation ticket" — the exact botanical ingredients and their
percentages, batch number, and pH — instead of vague marketing copy.

This submission contains **three separate projects that share one backend**:

```
bloomora/
├── backend/     Node.js + Express REST API (JWT auth, JSON file database)
├── frontend/    Customer-facing website (React + Vite)
└── admin/       Admin panel (React + Vite)
```

---

## 1. Tech stack

| Layer      | Technology |
|------------|------------|
| Backend    | Node.js, Express 5, JWT (jsonwebtoken), bcryptjs, express-validator |
| Database   | [lowdb](https://github.com/typicode/lowdb) — a JSON-file database. No MySQL/MongoDB server to install; the whole database is one readable file at `backend/data/db.json`. Perfect for local grading/demoing; swap for MongoDB/Postgres later if needed. |
| Frontend   | React 19 + Vite, React Router v6, plain CSS (custom design system, no UI library) |
| Admin      | React 19 + Vite, React Router v6, Recharts (dashboard chart) |

No native builds, no Docker, no paid services required. `npm install` + `npm run dev` is all each app needs.

---

## 2. Features

### Customer website
- Home page with hero, category grid, best-rated products, brand promise strip
- Product listing: search, category filter, price range, sort (price/rating/newest), pagination
- Product detail page with the "formulation ticket" (ingredients + % + batch + pH)
- Cart (persisted in localStorage) — add/update/remove, live totals, free shipping over Rs. 5,000
- Checkout — shipping address, phone, Cash on Delivery or Bank Transfer, order notes
- Register / Login (JWT-based)
- My Orders — order history + individual order tracker (status timeline)
- About and Contact pages (contact form posts to the backend and is visible in the admin inbox)
- Fully responsive (mobile nav, responsive grids)

### Admin panel (separate app, same backend)
- Login restricted to accounts with `role: admin`
- Dashboard — revenue, order count, product count, customer count, low-stock warning, order-status pie chart, top-selling products, recent orders
- Products — search/filter, add/edit/delete, per-ingredient formulation editor, stock and price validation
- Categories — add/edit/delete (blocked from deleting a category still in use)
- Orders — list with status filter, detail view, change order status (pending → processing → shipped → delivered, or cancelled)
- Customers — list with per-customer order count and lifetime spend
- Contact messages inbox

### Backend / validation / error handling
- JWT auth with bcrypt password hashing; `requireAuth` and `requireAdmin` middleware
- express-validator on all write endpoints (register, login, products, orders, contact)
- Stock is checked and decremented atomically when an order is placed; orders are rejected if requested quantity exceeds stock
- Centralized error handler + 404 handler for unknown API routes
- Categories can't be deleted while products still reference them

---

## 3. Running it locally

You'll need **Node.js 18+**. Open three terminals.

### Terminal 1 — Backend
```bash
cd backend
npm install
npm run seed      # populates categories, 12 products, and the admin account
npm start          # runs on http://localhost:5000
```

### Terminal 2 — Customer site
```bash
cd frontend
npm install
npm run dev         # runs on http://localhost:5173
```

### Terminal 3 — Admin panel
```bash
cd admin
npm install
npm run dev         # runs on http://localhost:5174 (Vite will pick a free port)
```

Both frontend apps read the API URL from `VITE_API_URL` (see `.env.example` in
each folder). If you don't set one, they default to `http://localhost:5000/api`,
which is correct for local development.

### Login credentials
| Role     | Email                  | Password    |
|----------|------------------------|-------------|
| Admin    | admin@bloomora.pk     | Admin@123   |
| Customer | *(register your own via the Sign Up page)* | — |

---

## 4. Project structure

```
backend/
├── server.js            Express app entry point
├── db.js                lowdb setup
├── data/db.json          the "database" (auto-created)
├── middleware/auth.js    JWT auth + admin-only guard
├── routes/
│   ├── auth.js            register / login / me
│   ├── products.js        public browse + admin CRUD
│   ├── categories.js      public list + admin CRUD
│   ├── orders.js          place order, my orders, admin order management
│   ├── admin.js           dashboard stats, customer list
│   └── contact.js         contact form + admin inbox
└── utils/seed.js         seed script

frontend/src/
├── api/client.js          fetch wrapper
├── context/               AuthContext, CartContext
├── components/            Navbar, Footer, ProductCard, FormulationTicket, ProtectedRoute
├── pages/                 Home, Products, ProductDetail, Cart, Checkout, Login, Register,
│                          Orders, OrderDetail, About, Contact, NotFound
├── App.jsx / main.jsx
└── index.css / layout.css  design tokens + component styles

admin/src/
├── api/client.js
├── context/AuthContext.jsx
├── components/            Sidebar, AdminLayout, Modal, ProductForm, ProtectedRoute
├── pages/                 Login, Dashboard, Products, Categories, Orders, OrderDetail,
│                          Customers, Messages
└── App.jsx / main.jsx
```

---

## 5. Deploying to get a live URL

This project wasn't deployed to a public host as part of this delivery — pick
any of the free options below (all support this stack directly):

**Backend** (Render, Railway, or Cyclic — any Node host):
1. Push the `backend/` folder to a GitHub repo (or the whole `bloomora/` repo).
2. On Render: New → Web Service → point at the repo/`backend` folder.
3. Build command: `npm install`. Start command: `npm start`.
4. Add a "Pre-Deploy Command" or a one-off shell run of `npm run seed` so the
   database file gets created with initial data (or just let the app create an
   empty `data/db.json` and add products from the admin panel).
5. Note the resulting URL, e.g. `https://bloomora-api.onrender.com`.

**Frontend & Admin** (Vercel or Netlify):
1. Import `frontend/` as one project and `admin/` as a second project (same repo, different root directory).
2. Set the environment variable `VITE_API_URL` to your deployed backend URL + `/api`,
   e.g. `https://bloomora-api.onrender.com/api`.
3. Build command: `npm run build`. Output directory: `dist`.
4. Deploy both — you'll get two URLs, one for customers and one for admin.

**Backend** (Vercel, Render, Railway, or any Node host):
1. Deploy the `backend/` folder as a separate Node project.
2. Add Firestore credentials via environment variables. Use one of these options:
   - `FIREBASE_ADMIN_CREDENTIALS` containing the full service account JSON string.
   - `GOOGLE_APPLICATION_CREDENTIALS` set to a local service account key file path.
   - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`.
3. Startup command: `npm install && npm start`.
4. There is no local `data/db.json` file anymore; data is saved in Firestore.

**Vercel configuration files**
- `backend/vercel.json` deploys the Node API.
- `frontend/vercel.json` and `admin/vercel.json` deploy the static Vite apps.

> Note: this backend now uses Firestore instead of local JSON storage, so it is suitable for Vercel-hosted APIs and avoids filesystem persistence issues on ephemeral hosts.

---

## 6. Notes for the reviewer

- The database starts pre-seeded (`npm run seed`) with 5 categories, 12 products
  with real formulation data, and one admin account. Running `npm run seed`
  again wipes products/categories back to this state (handy if grading breaks something).
- Product images are hotlinked from Unsplash for demo purposes; in a real
  deployment these would be uploaded assets.
- Payment is simulated (Cash on Delivery / Bank Transfer selection only) —
  no real payment gateway is wired in, as is typical for a student project.
