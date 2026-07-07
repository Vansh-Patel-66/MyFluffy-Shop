# ⚙️ MyFluffy Shop — Backend API Server

This is the API server for the **MyFluffy Shop** e-commerce platform. It is built using **Express.js**, **PostgreSQL** via the **Sequelize ORM**, and features media uploads using **Cloudinary**, automated notifications via **Nodemailer**, database backups via **Node-Cron**, and real-time support via **Socket.io**.

---

## 🚀 Features

* **ORM Database Synchronization**: Fully managed PostgreSQL schema sync with Sequelize (`alter: true`).
* **Authentication & Permissions**: Role-based access control with secure password hashing (`bcryptjs`) and JSON Web Token verification (`jsonwebtoken`).
* **API Documentation**: Automated Interactive Swagger documentation exposed at `/api-docs`.
* **Database Backup Service**: Automated scheduled backups running using `node-cron`.
* **Advanced Security**: Protected by `helmet` HTTP headers, `cors` domain controls, and request rate-limiting.
* **Logging System**: Full execution monitoring with `winston` outputting structured logs to files and standard output.
* **Media Cloud Pipeline**: Integrated file upload structure leveraging `multer` and `multer-storage-cloudinary` to directly upload product assets to Cloudinary.
* **Notifications**: Mailer pipeline utilizing Gmail SMTP credentials for transaction confirmations and email verification.
* **Real-time Engine**: Integrated `socket.io` server setup for polling transports and rooms mapping.

---

## 📦 Directory Structure

```
Backend/
├── api-doc/            # Swagger static assets
├── docs/               # Technical documents
├── logs/               # Application log output files (winston logs)
├── src/                # Main source code
│   ├── app.js          # App entrypoint & HTTP server
│   ├── config/         # Sequelize Postgres connections & configurations
│   ├── controllers/    # Route controllers (admin & website operations)
│   ├── middleware/     # Global auth (protect, rules) and rate-limiters
│   ├── models/         # Sequelize Schema models (users, address, products, etc.)
│   ├── routes/         # Divided api routes (admin/ and website/)
│   ├── validations/    # Request payload validators (Joi schemas)
│   └── utils/          # Winston loggers, Node-cron backup script, SMTP configs
├── tests/              # Test suites (Jest + Supertest)
├── jest.config.js      # Testing configuration
├── seed.js             # Local PostgreSQL database seeder script
├── package.json        # NPM scripts & dependencies list
└── .env                # Environment secrets configuration (Excluded from git)
```

---

## 🛠️ Requirements & Setup

Make sure you have a **PostgreSQL** server instance running, along with a database named `Store` (or update your `PG_DB_URL` accordingly).

### 1. Install Dependencies
Navigate to the `Backend` directory and install the packages:
```bash
cd Backend
npm install
```

### 2. Configure Environment Variables (`.env`)
Create a `.env` file in the root of the `Backend/` directory and populate it with the following configuration details:

```env
NODE_ENV=development
PORT=3000
PG_DB_URL=postgres://<username>:<password>@localhost:5432/<database_name>
PG_TEST_DB_URL=postgres://<username>:<password>@localhost:5432/<test_database_name>
JWT_SECRET=your_super_jwt_secret_key_string
JWT_EXPIRES_IN=30d

# Email Configuration (SMTP/Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-google-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=MyFluffyShop

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Initialize & Seed Database
Synchronize the tables with your local PostgreSQL database and load seed data:
```bash
node seed.js
```
*Note: This script registers categories (Cozy Pillows, Lovable Plushies, etc.), sample products, default roles, and users.*

---

## 🏃 Running the Server

### Development Mode (with hot-reload)
```bash
npm run dev
```
Starts the API server at [http://localhost:3000](http://localhost:3000). The database connection is validated automatically and synchronized.

### Running Test Suite (Jest + Supertest)
```bash
npm run test
```
To run tests in watch mode:
```bash
npm run test:watch
```

---

## 🗺️ API Reference & Routes

All routes are prefixed with `/api` and documented interactive details can be found at [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

### Authentication & Users
* `POST /api/users/register` - Create a new user account.
* `POST /api/users/login` - Login to a user account & return a JWT token.
* `GET /api/users/verify/:token` - Verify email through token confirmation link.
* `GET /api/users/:email` - Get detailed metadata about a user (Protected).

### E-Commerce Modules (Admin & Website)
* **Categories**: `/api/categories` (CRUD operations for shop categories)
* **Products**: `/api/products` & `/api/product-images` (Manage soft toy products and images)
* **Cart**: `/api/carts` & `/api/cart-items` (Fetch, add items, and clear cart states)
* **Orders**: `/api/orders` & `/api/order-items` (Placing orders, verifying states)
* **Addresses**: `/api/addresses` (Manage billing and shipping locations)
* **Payments**: `/api/payments` (Transaction logs & status transitions)
* **Analytics**: `/api/analytics` (Admin dashboard sales, traffic, and statistics)
* **Roles**: `/api/role` (User role mappings and configurations)
