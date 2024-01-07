import { Sequelize } from "sequelize";

const DB_NAME: any = process.env.DB_NAME;
const DB_USER: any = process.env.DB_USER;
const DB_PASS: any = process.env.DB_PASS;
const DB_HOST: any = process.env.DB_HOST;
const DB_PORT: any = process.env.DB_PORT;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  // logging: false,
});

export default sequelize;
