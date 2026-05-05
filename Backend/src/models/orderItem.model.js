import { DataTypes } from "sequelize";
import dbConnection from "../config/database.js";
import Order from "./order.model.js";
import Product from "./product.model.js";

const OrderItem = dbConnection.define(
  "order_items",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    order_id: { type: DataTypes.UUID, allowNull: false },
    product_id: { type: DataTypes.UUID, allowNull: false },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    gst_rate: { type: DataTypes.DECIMAL(5, 2) },
    total_price: { type: DataTypes.DECIMAL(10, 2) },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

OrderItem.belongsTo(Order, { foreignKey: "order_id" });
Order.hasMany(OrderItem, { foreignKey: "order_id" });

OrderItem.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(OrderItem, { foreignKey: "product_id" });

export default OrderItem;
