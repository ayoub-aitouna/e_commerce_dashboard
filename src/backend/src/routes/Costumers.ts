import { Router } from "express";

import { ListCostumers, SaveCostumers } from "../controllers/Costumers";

const CostumersRouter = Router();

CostumersRouter.get("/", ListCostumers);
CostumersRouter.get("/save", SaveCostumers);

export default CostumersRouter;