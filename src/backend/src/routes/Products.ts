import {
    ProductList,
    AddNewProduct,
    SellProduct,
    UpdateUrl,
    EditOnAProduct,
    DeleteProduct,
    SearchProduct,
    ListAllPurchase
} from "../controllers/Products";
import { Router } from "express";
const ProductRouter = Router();

ProductRouter.get("/", ProductList);
ProductRouter.post("/", AddNewProduct);
ProductRouter.patch("/", EditOnAProduct);
ProductRouter.delete("/", DeleteProduct);
ProductRouter.post("/sell", SellProduct);
ProductRouter.get("/UpdateUrl", UpdateUrl);
ProductRouter.get("/Search", SearchProduct);
ProductRouter.get("/Purchases", ListAllPurchase);
export default ProductRouter;