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

const dbUrl = process.env.NODE_ENV === "test" 
  ? process.env.PG_TEST_DB_URL 
  : process.env.PG_DB_URL;

const dbConnection = new Sequelize(dbUrl, proConfig);

export default dbConnection;
