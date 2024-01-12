import { Router } from "express";

const CostumersRouter = Router();

CostumersRouter.get("/:page", (req, res) => { });
CostumersRouter.get("/save", (req, res) => { });
CostumersRouter.post("/", (req, res) => { });


export default CostumersRouter;