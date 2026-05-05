import { DataTypes } from "sequelize";
import dbConnection from "../config/database";

const Permission = dbConnection.define(
  "permissions",
  {
    id: {
      type: DataTypes.UUID,
      defaulValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    model_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permission_action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permission_slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);
export default Permission;
