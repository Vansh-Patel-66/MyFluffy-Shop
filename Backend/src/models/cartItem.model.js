import { DataTypes } from "sequelize";
import dbConnection from "../config/database.js";
import Cart from "./cart.model.js";
import Product from "./product.model.js";

const CartItem = dbConnection.define(
  "cart_items",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    cart_id: { type: DataTypes.UUID, allowNull: false },
    product_id: { type: DataTypes.UUID, allowNull: false },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

CartItem.belongsTo(Cart, { foreignKey: "cart_id" });
Cart.hasMany(CartItem, { foreignKey: "cart_id" });

CartItem.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(CartItem, { foreignKey: "product_id" });

export default CartItem;
