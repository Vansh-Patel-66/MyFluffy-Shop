import { DataTypes } from "sequelize";
import dbConnection from "../config/database.js";
import User from "./user.model.js";

const Cart = dbConnection.define(
  "carts",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: { type: DataTypes.UUID, allowNull: false },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

Cart.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Cart, { foreignKey: "user_id" });

export default Cart;
