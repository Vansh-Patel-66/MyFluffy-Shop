import { DataTypes } from "sequelize";
import dbConnection from "../config/database.js";
import Order from "./order.model.js";

const Payment = dbConnection.define(
  "payments",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    order_id: { type: DataTypes.UUID, allowNull: false },
    payment_method: { type: DataTypes.STRING },
    transaction_id: { type: DataTypes.STRING },
    payment_status: { type: DataTypes.STRING, defaultValue: "pending" },
    paid_at: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

Payment.belongsTo(Order, { foreignKey: "order_id" });
Order.hasMany(Payment, { foreignKey: "order_id" });

export default Payment;
