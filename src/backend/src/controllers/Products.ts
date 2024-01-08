import { ProductAttributes } from "../models/Atterbuites/Product";
import { Request, Response } from "express";
import db from "../models";
import { BadRequest } from "../errors";

const AddNewProduct = async (req: Request, res: Response) => {
    try {
        const { iptv_url, type } = req.body;
        if (!iptv_url || !type)
            throw new BadRequest("invalide Request Body");
        const productvalues = { iptv_url, type } as ProductAttributes;
        const result = await db.product.create(productvalues);
        return res.status(200).json({
            result
        });
    } catch (error: any) {
        return res.status(500).json(`err ${error}`);
    }
}

const EditOnAProduct = async (req: Request, res: Response) => {

}

const SellProduct = async (req: Request, res: Response) => {

}


export { AddNewProduct, EditOnAProduct, SellProduct }