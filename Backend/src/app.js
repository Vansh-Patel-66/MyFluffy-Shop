import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import dbConnection from "./config/database.js";
import cronJobs from "./utils/cronJobs.js";
import logger from "./utils/logger.js";
import { Server } from "socket.io";
import cors from "cors";

// Catch uncaught exceptions before they crash the process silently
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

import websiteUserRoutes from "./routes/website/user.routes.js";
import categoryRoutes from "./routes/admin/category.routes.js";
import productRoutes from "./routes/admin/product.routes.js";
import productImageRoutes from "./routes/admin/productImage.routes.js";
import cartRoutes from "./routes/admin/cart.routes.js";
import cartItemRoutes from "./routes/admin/cartItem.routes.js";
import orderRoutes from "./routes/website/order.routes.js";
import orderItemRoutes from "./routes/admin/orderItem.routes.js";
import paymentRoutes from "./routes/admin/payment.routes.js";
import addressRoutes from "./routes/admin/address.routes.js";
import contactUsRoutes from "./routes/admin/contactUs.routes.js";
import footerRoutes from "./routes/website/footer.routes.js";
import analyticsRoutes from "./routes/admin/analytics.routes.js";
import roleRoutes from "./routes/admin/role.routes.js";

const app = express();

dotenv.config();

if (process.env.NODE_ENV !== "development") {
  cronJobs.createBackUpFile();
} else {
  cronJobs.createBackUpFile();
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MyFluffy Shop API",
      version: "1.0.0",
      description: "API documentation for MyFluffy Shop",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/**/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/users", websiteUserRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/product-images", productImageRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/cart-items", cartItemRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/contact-us", contactUsRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/role", roleRoutes);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Only send stack traces in development mode
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

//connect database and create tables
dbConnection
  .authenticate()
  .then(() => {
    return dbConnection.sync({ alter: true });
  })
  .then(() => {
    logger.info("Database synchronized successfully.");
  })
  .catch((error) => {
    logger.error(`Unable to connect to the database: ${error.message}`);
  });

//start normal express server
const server = app.listen(process.env.PORT, () => {
  logger.info(`server is running on http://localhost:${process.env.PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful Shutdown on termination signals
const gracefulShutdown = async () => {
  logger.info("SIGINT/SIGTERM received. Shutting down gracefully...");
  server.close(async () => {
    logger.info("HTTP server closed.");
    try {
      await dbConnection.close();
      logger.info("Database connection closed.");
      process.exit(0);
    } catch (err) {
      logger.error(`Error during database disconnection: ${err.message}`);
      process.exit(1);
    }
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

const io = new Server(server, {
  transports: ["polling"],
  cors: { origin: "*" },
});

//socket.io connection
io.on("connection", (socket) => {
  socket.on("join", (room) => {
    console.log(room, "this is room");
    socket.join(room);
  });
  socket.on("disconnect", () => {});
});
