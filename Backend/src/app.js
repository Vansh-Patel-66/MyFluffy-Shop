import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/database.js";
import cronJobs from "./utils/cronJobs.js";
import { Server } from "socket.io";
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
app.use(express.json());

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

//connect database and create tables
dbConnection
  .authenticate()
  .then(() => {
    return dbConnection.sync({ alter: true });
  })
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error.message);
  });

//start normal express server
const server = app.listen(process.env.PORT, () => {
  console.log(`server is running on http://localhost:${process.env.PORT}`);
});

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
