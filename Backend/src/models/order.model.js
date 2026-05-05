import { DataTypes } from "sequelize";
import dbConnection from "../config/database.js";
import User from "./user.model.js";

const Order = dbConnection.define(
  "orders",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: { type: DataTypes.UUID, allowNull: false },
    sub_total_amount: { type: DataTypes.DECIMAL(10, 2) },
    discount_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    delivery_charge: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    finale_amount: { type: DataTypes.DECIMAL(10, 2) },
    tax_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    payment_status: { type: DataTypes.STRING, defaultValue: "pending" },
    order_status: { type: DataTypes.STRING, defaultValue: "pending" },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

Order.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Order, { foreignKey: "user_id" });

export default Order;
