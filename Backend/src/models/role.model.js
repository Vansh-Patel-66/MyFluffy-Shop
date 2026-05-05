import { DataTypes } from "sequelize";
import dbConnection from "../config/database.js";

const Role = dbConnection.define(
  "roles",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    role_name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);
export default Role;
