# E-Cart React Full Stack Application

This project is a full-stack e-commerce cart application built with React (frontend) and Node.js with Express and MongoDB (backend). The app features products fetched from the Fake Store API, with cart functionality including optimistic UI updates, and responsive UI.

---

## Features

- Product listing fetched live through backend proxy from Fake Store API
- Add-to-cart functionality
- Cart management with:
  - Add, remove, quantity update (with debounced backend sync)
  - Persistent cart data saved in MongoDB
- Checkout flow with order receipt generation
- Responsive UI built with Tailwind CSS
- Optimistic UI updates for fast, smooth user experience
- Backend APIs built with Express and Mongoose, integrating Fake Store API for product data
- Authentication-ready structure (can be extended)

---

## Tech Stack

### Frontend

- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling (using NativeWind or web-tailored)
- Axios for API communication
- Context API for global cart state management with optimistic, debounced actions

### Backend

- Node.js with Express.js
- MongoDB Atlas with Mongoose ODM
- Axios for integrating Fake Store API product data
- RESTful API endpoints for cart and checkout

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account and connection URI
- Expo CLI (for React Native)

### Setup Backend

1. Clone the repo
2. Navigate to `backend/`
3. Create `.env` with your MongoDB URI
4. Run:
   ```bash
   npm install
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

### Setup Frontend

1. Navigate to `frontend/`
2. Run:
   ```bash
   npm install
   npm run dev -- --host
   ```
3. Open the in web browser

---

## API Overview

- `GET /api/products` — Fetch all products (proxied from Fake Store API)
- `GET /api/cart` — Get current user cart with product details
- `POST /api/cart` — Add product to cart
- `PUT /api/cart/:id` — Update quantity of cart item
- `DELETE /api/cart/:id` — Remove cart item
- `POST /api/checkout` — Create a checkout receipt (mock)

---

## Usage

- Browse products on the Products page
- View product details and add them to your cart
- Modify quantities or remove items from cart
- Proceed to checkout and get receipt
- Cart state syncs with backend and persists across sessions

---

[Watch sample video](https://www.loom.com/share/47db67038e4b40f6a9754dbfefee452f)

---
