import express, { Express, Request, Response, json } from "express";
import dotenv from "dotenv";
import db from "./models";
import AuthRouter from "./routes/Auth";
import ProductRouter from "./routes/Products";
import { authenticationMiddleware, Sign } from "./middleware/Auth/auth";
import errorHandlerMiddleware from "./middleware/error-handler";
import notFound from "./middleware/notFound";

dotenv.config();
const port = process.env.PORT || 3000;
const app: Express = express();
import 'express-async-errors'; // Import the library
import { AdminAtterbuites } from "./models/Atterbuites/Admin";

app.use(json());

app.get('/', (req, res) => {
})

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/product", ProductRouter);
app.get("/api/v1/get-token", (req: Request, res: Response) => {
  const Admin = {
    id: 10,
    email: "email@email.com",
    password: "0102120215@@",
    api_token: "0102120215@@",
    created_at: new Date(),
    updated_at: new Date()
  } as AdminAtterbuites;
  const tokens = Sign(Admin);
  res.json(tokens);
});

app.use(notFound);
app.use(errorHandlerMiddleware);


db.sequelize.sync({ alter: false }).then(() => {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
});
