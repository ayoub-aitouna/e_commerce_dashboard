import { AddNewProduct } from "../controllers/Products";
import { Router } from "express";
const ProductRouter = Router();

ProductRouter.post("/", AddNewProduct);
// ProductRouter.get("/Sell", (req, res) => { });
// ProductRouter.post("/Edit", (req, res) => { });
// ProductRouter.delete("/delete", (req, res) => { });

export default ProductRouter;