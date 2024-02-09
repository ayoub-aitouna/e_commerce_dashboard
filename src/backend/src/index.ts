import express, { Express, Request, Response, json } from "express";
import dotenv from "dotenv";
import db from "./models";
import AuthRouter from "./routes/Auth";
import ProductRouter from "./routes/Products";
import CostumersRouter from "./routes/Costumers";
import ReferenceRouter from "./routes/Reference";
import StaticsRouter from "./routes/Statics";

import { errorHandler } from "./middleware/error-handler";
import notFound from "./middleware/notFound";
import { Admins, SeedAdminTable } from "./seeders/Admins";
import cors from 'cors'
import { authenticationMiddleware } from "./middleware/Auth/auth";
require('express-async-errors');


dotenv.config();
const port = process.env.PORT || 3000;
const app: Express = express();
app.use(cors());



app.use(json());

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/costumers", CostumersRouter);
app.use("/api/v1/reference", ReferenceRouter);
app.use("/api/v1/statics", StaticsRouter);

app.get("/", (req: Request, res: Response) => {
  res.send(db);
});

app.use(notFound);
app.use(errorHandler);

const RESET = false;
db.sequelize.sync({ force: RESET }).then(async () => {
  const adminlist = await Admins();
  SeedAdminTable(db, adminlist);

});

async function setupDatabase() {
  // Replace this with your actual database setup code
  try {
    const RESET = process.env.RESET === 'true';
    console.log({
      MYSQL_DATABASE: process.env.MYSQL_DATABASE,
      MYSQL_USER: process.env.MYSQL_USER,
      MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
      MYSQL_HOST: process.env.MYSQL_HOST,
      RESET
    });
    await db.sequelize.sync({ force: RESET });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

}

async function seedDatabase() {
  const adminlist = await Admins();
  await SeedAdminTable(db, adminlist);
}

// Use an IIFE (Immediately Invoked Function Expression) to use async/await at the top level
(async () => {
  await setupDatabase();
  await seedDatabase();



  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
})();