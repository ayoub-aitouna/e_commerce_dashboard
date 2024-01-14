import { ProductAttributes, IpTvType } from "../models/Atterbuites/Product";
import { NextFunction, Request, Response } from "express";
import { CostumersAttrebues } from "@/models/Atterbuites/Costumers";
import { BadRequestError, InvalideBody } from "../errors";
import { log } from "console";
import { SendEmail, generateEmailTemplate } from "../mailer/mailer";
import db from "../models";
import Queue from 'better-queue';
import { str2Boolean } from '../utils/str2Boolean';

let emailQueue = new Queue(async (emailTask: any, cb: any) => {
    const { email, url } = emailTask;
    const username = url.searchParams.get('username');
    const pass = url.searchParams.get('password');

    await SendEmail({
        to: email,
        subject: 'Product Purchase Confirmation',
        text: 'Thank you for purchasing our product.',
        html: await generateEmailTemplate(username, pass, url, 'fr'),
    })
    cb();
});

const SendMailToCostumer = async (email: string, url: URL) => {
    emailQueue.push({ email, url });

}


function generateWhereClause(sold: any, type: any) {
    let where = {} as any;

    if (sold !== undefined && sold !== null) {
        where.sold = sold;
    }

    if (Object.values(IpTvType).includes(type)) {
        where.type = type;
    }
    console.log("where", where);
    return where;
}

export const ProductList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const sold: any = req.query.sold;
        const type: any = req.query.type;

        const offset = (page - 1) * limit;
        const result = await db.product.findAll({
            limit: limit,
            offset: offset,
            where: generateWhereClause(sold, type)
        });
        return res.status(200).json(result);
    } catch (error: any) {
        return next(error);
    }
}

const checkIfUrlIsValide = (url: string) => {
    try {
        new URL(url);
        return true
    } catch (error) {
        return false;
    }
}

export const UpdateUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const UpdatedDns = req.query.UpdatedDns;
        if (!UpdatedDns || typeof UpdatedDns !== "string" || !checkIfUrlIsValide(UpdatedDns))
            throw new InvalideBody();
        const products: ProductAttributes[] = await db.product.findAll({ where: { sold: false } });
        if (products.length !== 0) {
            const updatedProducts = products.map((product) => {
                let url = new URL(product.iptv_url);
                let newurl = new URL(UpdatedDns);
                url.hostname = newurl.hostname;
                url.port = newurl.port;
                url.protocol = newurl.protocol;
                return { id: product.id, iptv_url: url.toString() };
            });
            await db.product.bulkCreate(updatedProducts, { updateOnDuplicate: ["iptv_url"] });
        }


        const costumers: CostumersAttrebues[] = await db.costumers.findAll({ where: { bought: true } });
        for (let costumer of costumers) {
            log("UpdateUrl Sending email to: ", costumer.Email);
            SendMailToCostumer(costumer.Email, new URL(UpdatedDns));
        }

        return res.status(200).send({ msg: "ok" });
    } catch (error: any) {
        next(error);
    }
}

export const AddNewProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { iptv_url, type } = req.body;

        if (!iptv_url || !Object.values(IpTvType).includes(type))
            throw new BadRequestError({ code: 400, message: "Invalid Url Or Type", logging: true });
        if (!checkIfUrlIsValide(iptv_url))
            throw new BadRequestError({ code: 400, message: "Invalid url", logging: true });


        const productvalues = { iptv_url, type } as ProductAttributes;

        const result = await db.sequelize.transaction(async (t: any) => {

            const pendding_costumer
                = await db.costumers.findOne({
                    where: { pendding: true }, transaction: t
                });

            if (pendding_costumer) {
                Object.assign(pendding_costumer,
                    {
                        bought: true,
                        pendding: false,
                        bought_at: new Date(),
                        pendding_at: null
                    });

                await pendding_costumer.save({ transaction: t });

                Object.assign(productvalues,
                    {
                        sold: true,
                        solded_at: new Date()
                    });

                SendMailToCostumer(pendding_costumer.Email,
                    new URL(productvalues.iptv_url));
            }

            const result = await db.product.create(productvalues, { transaction: t });
            return result;

        });

        return res.status(200).json({
            result
        });
    } catch (error: any) {
        next(error);
    }
}

export const EditOnAProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, iptv_url, type } = req.body;
        if (!id || !Object.values(IpTvType).includes(type) || !checkIfUrlIsValide(iptv_url))
            throw new InvalideBody();
        log("EditOnAProduct", id, iptv_url, type)
        const product = await db.product.findByPk(id);
        if (!product)
            throw new BadRequestError({ code: 404, message: "Product not found", logging: true });
        if (iptv_url)
            product.iptv_url = iptv_url;
        if (type)
            product.type = type;
        await product.save();
        return res.status(200).json({ msg: "ok" });
    } catch (error: any) {
        next(error);
    }
}

const CreateCostumer = async (email: string, bought: boolean, pendding: boolean): Promise<CostumersAttrebues> => {
    const costumer: CostumersAttrebues = await db.costumers.create({
        Email: email,
        bought: bought,
        pendding: pendding
    });
    return costumer;
}

export const SellProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { api_token, email, selected_plan } = req.body;

        if (!Object.values(IpTvType).includes(selected_plan) || !api_token || !email)
            throw new InvalideBody();

        const { count } = await db.admin.findAndCountAll({ where: { api_token: api_token } });
        if (count === 0)
            return res.status(401).json({ msg: "unauthorized" });

        const product: ProductAttributes = await db.product.findOne({ where: { sold: false, type: selected_plan } });
        if (!product) {
            log("No product found ", email);
            await CreateCostumer(email, false, true);
            return res.status(200).json({ msg: "pendding" });
        }


        await SendMailToCostumer(email, new URL(product.iptv_url));
        await db.product.update({ sold: true }, { where: { id: product.id } });

        let costumer = await CreateCostumer(email, true, false);
        await db.purchases.create({
            product_id: product.id,
            Costumer_id: costumer.id,
        });

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
        if (!result)
            return res.status(404).json({ msg: "Product not found" });
        return res.sendStatus(204);
    }
    catch (error: any) {
        next(error);
    };
};

