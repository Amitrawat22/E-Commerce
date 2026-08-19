# ⚡ Full-Stack E-Commerce Application

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.0-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.2.0-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JWT](https://img.shields.io/badge/JWT-Stateless_Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

A modern, production-ready, full-stack E-Commerce platform built with **Spring Boot 3.4**, **PostgreSQL**, **Spring Security + JWT**, and **React 18** with **Redux Toolkit** and **Vite**.

Designed with a clean commercial user interface, real-time cart calculations, inventory tracking, multi-role security (Admin/User), and an automatic database data seeder.

---

## 🌟 Key Features

### 🛒 Shopping Experience
- **Dynamic Catalog**: Browse 100+ seeded products across multiple categories (Electronics, Fashion, Home, Books, Sports, Beauty).
- **View Toggle**: Switch seamlessly between **Grid View** and **List View**.
- **Instant Search & Filters**: Live search by product name/description, category filter chips, and multi-field sorting (Price, Newest, A-Z).
- **Smart Image Mapping**: Automatic product-to-image resolution based on categories and keywords.
- **Product Details Page**: Stock indicators, discount calculations, quantity selectors, and instant "Buy Now" flow.

### 🛍️ Shopping Cart & Checkout
- **Persistent Cart**: Synced with PostgreSQL database per user session.
- **Quantity Controls**: Add, increment, decrement, and remove items with real-time total recalculation.
- **Free Shipping Threshold**: Dynamic shipping calculation (Free above ₹500).
- **Address Management**: Save multiple shipping addresses with validation.
- **Multi-Method Checkout**: Cash on Delivery (COD), Credit/Debit Card, UPI, and Net Banking.

### 📦 Order Management
- **Automated Order Placement**: Instant order creation, payment record generation, stock deduction, and cart auto-clearing.
- **Order History**: Track past orders, view ordered items, delivery status, and payment summary.
- **Admin Order Control**: Update status (`Order Accepted!`, `Shipped`, `Out for Delivery`, `Delivered`, `Cancelled`).

### 🔐 Security & Administration
- **Stateless JWT Auth**: Secure authentication via JSON Web Tokens with password hashing (`BCryptPasswordEncoder`).
- **Role-Based Access Control (RBAC)**: Enforced roles (`ROLE_ADMIN`, `ROLE_SELLER`, `ROLE_USER`).
- **Admin Dashboard**: Overview metrics (Total Products, Orders, Revenue, Avg Order Value), recent orders, and CRUD management for products & categories.
- **Auto Data Seeding**: Unconditional startup seeder seeding 130+ products and demo admin/customer accounts.

---

## 🏗️ Tech Stack

### **Backend**
- **Framework**: Spring Boot 3.4.0
- **Language**: Java 21 / 25
- **Persistence**: Spring Data JPA / Hibernate
- **Database**: PostgreSQL
- **Security**: Spring Security 6 + JJWT 0.12.6
- **DTO Mapping**: ModelMapper 3.0.0 & Lombok 1.18.38
- **Validation**: Jakarta Validation

### **Frontend**
- **Framework**: React 18 (JavaScript / JSX)
- **Build Tool**: Vite
- **State Management**: Redux Toolkit & React-Redux
- **Routing**: React Router v6 (Protected & Admin Route Guards)
- **Forms**: React Hook Form
- **Icons & UI**: Lucide React & Custom Design System (CSS Tokens, 1440px wide responsive canvas)
- **Notifications**: React Toastify

---

## 📁 Repository Structure

```
E-Commerce-main/
├── src/                               # Spring Boot Java Source Code
│   ├── main/
│   │   ├── java/com/ecommerce/project/
│   │   │   ├── config/                # AppConfig, AppConstants, DataInitializer
│   │   │   ├── controller/            # Auth, Product, Category, Cart, Order, Address
│   │   │   ├── exceptions/            # Global Exception Handler & Custom Exceptions
│   │   │   ├── model/                 # JPA Entities (User, Role, Product, Cart, Order, etc.)
│   │   │   ├── payload/               # Request & Response DTOs
│   │   │   ├── repositories/         # Spring Data JPA Repositories
│   │   │   ├── security/              # WebSecurityConfig, JWT Utils & Filters
│   │   │   └── service/               # Service Interfaces & Implementations
│   │   └── resources/
│   │       └── application.properties # PostgreSQL & Security Configuration
├── frontend/                          # Vite + React Frontend Application
│   ├── src/
│   │   ├── api/                       # Axios Instances & Interceptors (Auth, Cart, Order, Product)
│   │   ├── components/                # Navbar, ProductCard, Pagination, ProtectedRoute
│   │   ├── pages/                     # Home, Products, ProductDetail, Cart, Checkout, Orders, Profile
│   │   │   └── admin/                 # AdminLayout, Dashboard, Products, Categories, Orders
│   │   ├── store/                     # Redux Toolkit Slices (auth, product, cart, order)
│   │   ├── utils/                     # Product Image Resolver Utility
│   │   ├── App.jsx                    # Router Config
│   │   ├── index.css                  # Global Commercial Design System
│   │   └── main.jsx                   # Entrypoint with Provider
│   ├── package.json
│   └── vite.config.js                 # Proxy to Backend on Port 8080
├── pom.xml                            # Maven Build Configuration
└── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Java JDK 21+**
- **Apache Maven 3.8+**
- **Node.js 18+ & npm**
- **PostgreSQL 14+** running locally on port `5432`

---

### 1. Database Configuration

Create the PostgreSQL database manually or via `psql`:

```bash
psql -U postgres -c "CREATE DATABASE ecommerce_db;"
```

Verify your credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ecommerce_db
spring.datasource.username=postgres
spring.datasource.password=Atlassian@Amit123
```

---

### 2. Start Backend (Spring Boot)

Navigate to the project root directory and launch the Spring Boot server:

```bash
# Compile and run
mvn spring-boot:run
```

> **Note**: On initial launch, `DataInitializer` will automatically seed default roles, demo user accounts, 6 categories, and 130+ products into PostgreSQL.

---

### 3. Start Frontend (React + Vite)

In a new terminal window:

```bash
cd frontend

# Install Dependencies
npm install

# Start Development Server
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Login Credentials

You can test both administrative and customer flows out of the box using these pre-seeded credentials:

| Role | Username | Password | Email | Access |
|---|---|---|---|---|
| 👑 **Administrator** | `admin` | `admin123` | `admin@ecommerce.com` | Full Admin Dashboard, Manage Products, Categories & Customer Orders |
| 👤 **Customer** | `john_doe` | `user123` | `john@example.com` | Browse Catalog, Cart, Save Addresses, Checkout & Track Orders |

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register new user account | Public |
| `POST` | `/api/auth/signin` | Authenticate user & return JWT token | Public |
| `GET` | `/api/auth/user` | Get logged-in user profile details | Authenticated |
| `POST` | `/api/auth/signout` | Clear security context | Authenticated |

### 🛍️ Products & Categories (`/api/public` & `/api/admin`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/public/products` | Get paginated products list | Public |
| `GET` | `/api/public/categories/{id}/products` | Get products filtered by category | Public |
| `GET` | `/api/public/products/keyword/{keyword}` | Search products by keyword | Public |
| `POST` | `/api/admin/categories/{id}/product` | Add new product under category | Admin / Seller |
| `PUT` | `/api/admin/products/{id}` | Update existing product details | Admin / Seller |
| `DELETE` | `/api/admin/products/{id}` | Delete product | Admin / Seller |

### 🛒 Shopping Cart (`/api/carts`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/carts/users/cart` | Get current user cart | Authenticated |
| `POST` | `/api/carts/products/{id}/quantity/{qty}` | Add product to cart | Authenticated |
| `PUT` | `/api/carts/products/{id}/quantity/{op}` | Increment/decrement product quantity | Authenticated |
| `DELETE` | `/api/carts/{cartId}/product/{id}` | Remove product from cart | Authenticated |

### 📦 Orders & Addresses (`/api`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/order/users/payments/{method}` | Place order from cart | Authenticated |
| `GET` | `/api/order/users/myorders` | Get user order history | Authenticated |
| `GET` | `/api/admin/orders` | Get all customer orders | Admin |
| `PUT` | `/api/admin/orders/{id}/orderStatus/{status}` | Update order status | Admin |
| `POST` | `/api/addresses` | Save new shipping address | Authenticated |
| `GET` | `/api/users/addresses` | Get saved user addresses | Authenticated |

---

## 🎨 UI Preview Highlights

- **1440px Fluid Layout**: Optimized for desktop and responsive devices.
- **View Switcher**: Instant transition between Grid Cards & List View.
- **Design Tokens**: Standardized CSS variables for consistent commercial styling.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.