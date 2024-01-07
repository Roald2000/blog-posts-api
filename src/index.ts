import dotenv from "dotenv";
dotenv.config({ path: "./.env", override: true });

import cors from "cors";
import express, { Application } from "express";
import sequelize from "./app/app.dbconfig";
import { Log } from "./app/app.helper";
import { errorHandler, invalidRoute } from "./app/app.middlewares";
import app_router from "./app/app.routes";

const app: Application = express();
app.use(cors());
app.use(express.json());

app.use("/api", app_router);

app.use(invalidRoute);
app.use(errorHandler);

const API_PORT: any = process.env.API_PORT;
const API_HOST_ADDRESS: any = process.env.API_HOST_ADDRESS;

app.listen(API_PORT, API_HOST_ADDRESS, async () => {
  Log("Starting ......");
  await sequelize.authenticate({
    retry: {
      max: 10,
      timeout: 5000,
    },
  });
  await sequelize.sync({ force: true });
  const tables = await sequelize.showAllSchemas({});
  Log(tables);
  Log(`App is Live @ ${API_HOST_ADDRESS}:${API_PORT}`);
});
