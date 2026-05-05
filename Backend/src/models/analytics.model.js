import { DataTypes } from "sequelize";
import dbConnection from "../config/database.js";

const Analytics = dbConnection.define(
  "analytics",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    total_sales: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
    total_orders: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_users: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_profile: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Analytics;
