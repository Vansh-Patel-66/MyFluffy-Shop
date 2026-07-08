import { DataTypes } from "sequelize";
import dbConnection from "../config/database.js";
import Category from "./categories.model.js";

const Product = dbConnection.define(
  "products",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    description: { type: DataTypes.TEXT },
    cost_price: { type: DataTypes.DECIMAL(10, 2) },
    selling_price: { type: DataTypes.DECIMAL(10, 2) },
    discount: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    category_id: { type: DataTypes.UUID, allowNull: true },
    image_url: { type: DataTypes.STRING },
    badge: { type: DataTypes.STRING },
    rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0 },
    number_of_ratings: { type: DataTypes.INTEGER, defaultValue: 0 },
    sizes: { type: DataTypes.STRING },
    colors: { type: DataTypes.STRING },
    material: { type: DataTypes.STRING },
    care: { type: DataTypes.STRING },
    featured_on_homepage: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

Product.belongsTo(Category, { foreignKey: "category_id" });
Category.hasMany(Product, { foreignKey: "category_id" });

export default Product;
