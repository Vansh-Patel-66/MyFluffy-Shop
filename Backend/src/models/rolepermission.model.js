import { DataTypes } from "sequelize";
import dbConnection from "../config/database";

const RolePermission = dbConnection.define(
  "rolepermissions",
  {
    id: {
      type: DataTypes.UUID,
      defaulValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);
RolePermission.belongsTo(Role, { foreignKey: "role_name" });
RolePermission.belongsTo(Permission, { foreignKey: "permission_id" });
Role.hasMany(RolePermission, { foreignKey: "role_name" });
Permission.hasMany(RolePermission, { foreignKey: "permission_id" });
export default RolePermission;
