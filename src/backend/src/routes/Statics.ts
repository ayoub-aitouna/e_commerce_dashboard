import { Router } from "express";

import { GetMonthStatics } from "../controllers/Statics";

const StaticsRouter = Router();

StaticsRouter.get("/", GetMonthStatics);

export default StaticsRouter;