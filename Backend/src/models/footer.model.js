import { DataTypes } from "sequelize";
import dbConnection from "../config/database.js";

const FooterContent = dbConnection.define(
  "footer_contents",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    facebook_link: { type: DataTypes.STRING },
    instagram_link: { type: DataTypes.STRING },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default FooterContent;
