import { ProductAttributes, IpTvType } from "../models/Atterbuites/Product";
import { NextFunction, Request, Response } from "express";
import { CostumersAttrebues } from "@/models/Atterbuites/Costumers";
import { BadRequestError, InvalideBody } from "../errors";
import db from "../models";
import { log } from "console";
import { SendEmail } from "../mailer/mailer";
import Queue from 'better-queue';


let emailQueue = new Queue(async (emailTask: any, cb: any) => {
    const { email, url } = emailTask;
    const username = url.searchParams.get('username');
    const pass = url.searchParams.get('password');
    const str_url = url.toString();

    await SendEmail({
        to: email,
        subject: 'Product Purchase Confirmation',
        text: 'Thank you for purchasing our product.',
        html: `<b>Thank you for purchasing our product.</b>
                password: ${pass}
                username: ${username}
                url: ${str_url}`,
    })
    cb();
});



const SendMailToCostumer = async (email: string, url: URL) => {
    emailQueue.push({ email, url });
}

export const ProductList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await db.product.findAll({
            where: {
                sold: false
            }
        });
        return res.status(200).json(result);
    } catch (error: any) {
        return next(error);
    }
}

export const UpdateUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const UpdatedDns = req.query.UpdatedDns;
        if (!UpdatedDns)
            throw new InvalideBody();
        const products: ProductAttributes[] = await db.product.findAll({ where: { sold: false } });
        if (products.length === 0)
            return res.status(404).json({ msg: "no product found" });

        const updatedProducts = products.map((product) => {
            let url = new URL(product.iptv_url);
            url.hostname = UpdatedDns as string;
            return { id: product.id, iptv_url: url.toString() };
        });

        await db.product.bulkCreate(updatedProducts, { updateOnDuplicate: ["iptv_url"] });

        const costumers: CostumersAttrebues[] = await db.costumers.findAll({ where: { bought: true } });
        for (let costumer of costumers) {
            // send mail to all costumers
            // in backround

        }

        return res.status(200).send({ msg: "ok" });
    } catch (error: any) {
        next(error);
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

export const EditOnAProduct = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const { id, iptv_url, type } = req.body;
        if (!id)
            throw new InvalideBody();
        const product = await db.product.findByPk(id);
        if (!product)
            throw new BadRequestError({ code: 404, message: "Product not found", logging: true });
        if (iptv_url)
            product.iptv_url = iptv_url;
        if (type)
            product.type = type;
        await product.save();
    } catch (error: any) {
        next(error);
    }
}



const CreateCostumer = async (email: string, bought: boolean, pendding: boolean) => {
    await db.costumers.create({
        Email: email,
        bought: bought,
        pendding: pendding,
        pendding_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    });
}

export const SellProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { api_token, email, selected_plan } = req.body;
        if (!Object.values(IpTvType).includes(selected_plan) || !api_token || !email)
            throw new InvalideBody();
        const { count } = await db.admin.findAndCountAll({ where: { api_token: api_token } });
        if (count === 0)
            return res.status(401).json({ msg: "unauthorized" });
        const products: ProductAttributes[] = await db.product.findAll({ where: { sold: false } });
        if (products.length === 0) {
            log("No product found ", email);
            await CreateCostumer(email, false, true);
            return res.status(200).json({ msg: "pendding" });
        }
        log("Selected : ", products[0].iptv_url);
        await SendMailToCostumer(email, new URL(products[0].iptv_url));
        await db.product.update({ sold: true }, { where: { id: products[0].id } });
        await CreateCostumer(email, true, false);
        return res.status(200).json({ msg: "ok" });
    } catch (error: any) {
        next(error);
    }

}

export const DeleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.query;
        if (!id)
            throw new InvalideBody();
        const result = await db.product.destroy({ where: { id: id } });
        return res.status(204).json({ result });
    }
    catch (error: any) {
        next(error);
    };
};

