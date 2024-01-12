import { AddNewProduct, SellProduct } from "../controllers/Products";
import { Router } from "express";
const ProductRouter = Router();

ProductRouter.post("/", AddNewProduct);
ProductRouter.patch("/", (req, res) => { });
ProductRouter.delete("/", (req, res) => { });
ProductRouter.post("/sell", SellProduct);

export default ProductRouter;