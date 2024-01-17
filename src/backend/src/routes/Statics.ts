import { Router } from "express";

import {
  GetStatics,
  GetWeekStatics,
  GetYearStatics,
  GetLatestPurchases
} from "../controllers/Statics";

const StaticsRouter = Router();

StaticsRouter.get("/", GetStatics);
StaticsRouter.get("/week", GetWeekStatics);
StaticsRouter.get("/year", GetYearStatics);
StaticsRouter.get("/latest-purchases", GetLatestPurchases);

export default StaticsRouter;
