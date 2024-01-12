import { ProductAttributes, IpTvType } from "../models/Atterbuites/Product";
import { AdminAtterbuites } from "../models/Atterbuites/Admin";
import { NextFunction, Request, Response } from "express";
import db from "../models";
import { BadRequestError, InvalideBody } from "../errors";
import { where } from "sequelize";
import { CostumersAttrebues } from "@/models/Atterbuites/Costumers";

export const ProductList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await db.product.findAll({
            where: {
                sold: false
            }
        });
        return res.status(200).json({
            result
        });
    } catch (error: any) {
        return next(error);
    }
}

export const AddNewProduct = async (req: Request, res: Response) => {
    try {
        const { iptv_url, type } = req.body;

        if (!iptv_url || !Object.values(IpTvType).includes(type))
            throw new InvalideBody();

        const productvalues = { iptv_url, type } as ProductAttributes;

        const result = await db.sequelize.transaction(async (t: any) => {

            const pendding_costumers: CostumersAttrebues[]
                = await db.costumers.findAll({
                    where: { pendding: true }, transaction: t
                });

            if (pendding_costumers && pendding_costumers.length > 0) {
                await db.costumers.update(
                    {
                        pendding: false, pendding_at: null,
                        bought: true, bought_at: new Date()
                    },
                    { where: { id: pendding_costumers[0].id }, transaction: t });
                productvalues.sold = true;
                productvalues.solded_at = new Date();
            }

            const result = await db.product.create(productvalues, { transaction: t });
            return result;

        });

        return res.status(200).json({
            result
        });
    } catch (error: any) {
        return res.status(500).json(`err ${error}`);
    }
}

export const EditOnAProduct = async (req: Request, res: Response) => {

}


// check body check api_token if valide
// select a product from the list of products
// update the product to be sold
// and send the product to the client via email

const SendMail = async (product: ProductAttributes) => {

}

export const SellProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { api_token, email, selected_plan } = req.body;
        if (!Object.values(IpTvType).includes(selected_plan) || !api_token || !email)
            throw new InvalideBody();
        const { count } = await db.admin.findAndCountAll({ where: { api_token: api_token } });
        const products: ProductAttributes[] = await db.product.findAll({ where: { sold: false } });
        if (products.length === 0) {
            // add to costumers table as pendding
            return;
        }
        await SendMail(products[0]);
        await db.product.update({ sold: true }, { where: { id: products[0].id } });
        return res.status(200).json({ msg: "ok" });
    } catch (error: any) {
        next(error);
    }

}

