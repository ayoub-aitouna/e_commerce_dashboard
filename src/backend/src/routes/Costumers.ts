import { Router } from "express";

import { ListCostumers, SaveCostumers, addCostumer ,SearchCostumer} from "../controllers/Costumers";

const CostumersRouter = Router();

CostumersRouter.get("/", ListCostumers);
CostumersRouter.post("/", addCostumer);
CostumersRouter.get("/save", SaveCostumers);
CostumersRouter.get("/Search", SearchCostumer);

export default CostumersRouter;