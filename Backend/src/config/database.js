import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const proConfig = {
  dialect: "postgres",
  logging: false,
  dialectOptions: {},
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
};

const dbConnection = new Sequelize(process.env.PG_DB_URL, proConfig);

export default dbConnection;
