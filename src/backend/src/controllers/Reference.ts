import { Request, Response, NextFunction } from 'express';
import db from '../models';
import { BadRequestError } from '../errors';
import { ProductAttributes, IpTvType } from "../models/Atterbuites/Product";
import { CostumersAttrebues } from "@/models/Atterbuites/Costumers";
import { log } from 'console';

import { SendEmail, generateEmailTemplate } from "../mailer/mailer";
import { languageEnum } from "../languages";
import Queue from "better-queue";

let emailQueue = new Queue(async (emailTask: any, cb: any) => {
    const { email, url, language, site } = emailTask;
    const username = url.searchParams.get("username");
    const pass = url.searchParams.get("password");
    try {
        await SendEmail({
            to: email,
            subject: "Product Purchase Confirmation",
            text: "Thank you for purchasing our product.",
            html: await generateEmailTemplate(
                username,
                pass,
                url,
                site,
                language,
                process.env.PHONE_NUMBER as string,
                process.env.MAILER_USER as string,
                true
            ),
        });
    } catch (error) {
        console.log(error);
    }
    cb();
});

const SendMailToCostumer = async (
    email: string,
    url: URL,
    language: languageEnum,
    site: string
) => {
    emailQueue.push({ email, url, language, site });
};

export const GetReference = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ref = await db.reference.findAll();
        res.status(200).json(ref);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Create '/reference',
export const PostReference = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { site, dns, basic_price, premuim_price, gold_price, elit_price } = req.body;

        // Check if all properties are valid
        if (!site || !dns || !basic_price || !premuim_price || !gold_price || !elit_price)
            throw new BadRequestError({ message: 'Invalid reference properties' });
        const reference = await db.reference.create(req.body);
        res.status(201).json(reference);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// Update '/reference/:id'
export const UpdateReference = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { site, dns, basic_price, premuim_price, gold_price } = req.body;

        // Check if all properties are valid
        if (!site || !dns || !basic_price || !premuim_price || !gold_price)
            throw new BadRequestError({ message: 'Invalid reference properties' });
        const reference = await db.reference.findByPk(req.params.id);
        if (!reference)
            throw new BadRequestError({ code: 404, message: 'Not found' });
        await reference.update(req.body);
        
        // select all products inner join reference 
        const products: ProductAttributes[] = await db.product.findAll({
            include: [{
                model: db.reference,
                required: true,
                where: { id: req.params.id }
            }]
        });

        console.log("products lenght:",products.length);
        if (products.length !== 0) {
            const updatedProducts = products.map((product) => {
                let url = new URL(product.iptv_url);
                let newurl = new URL(dns);
                url.hostname = newurl.hostname;
                url.port = newurl.port;
                url.protocol = newurl.protocol;
                return { id: product.id, iptv_url: url.toString() };
            });
            await db.product.bulkCreate(updatedProducts, {
                updateOnDuplicate: ["iptv_url"],
            });
        }

        // select all costumers inner join reference
        const costumers: CostumersAttrebues[] = await db.costumers.findAll({
            include: [{
                model: db.purchases,
                required: true,
                include: [{
                    model: db.product,
                    required: true,
                    include: [{
                        model: db.reference,
                        required: true,
                        where: { id: req.params.id }
                    }]
                }]
            }]
        });
        for (let costumer of costumers) {
            log("UpdateUrl Sending email to: ", costumer.Email);
            SendMailToCostumer(
                costumer.Email,
                new URL(dns),
                costumer.language as languageEnum,
                costumer.referenceSite
            );
        }
        res.json({ message: 'Updated successfully' });

    } catch (err) {
        console.error(err);
        next(err);
    }
};

// Delete '/reference/:id'
export const deleteReferece = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reference = await db.reference.findByPk(req.params.id);
        if (!reference)
            return res.status(404).json({ message: 'Not found' });
        await db.reference.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// Search '/reference/Search'
export const SearchReference = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const searchQuery = req.query.searchQuery;
        const reference = await db.reference.findAll({
            where: {
                site: {
                    [db.Sequelize.Op.like]: `%${searchQuery}%`
                }
            }
        });
        res.status(200).json(reference);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Get List Of dns '/reference/dns'
export const GetReferenceDns = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ref = await db.reference.findAll({
            attributes: ['dns']
        });
        res.status(200).json(ref);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Get List Of site '/reference/site'
export const GetReferenceSite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ref = await db.reference.findAll({
            attributes: ['id', 'site']
        });
        res.status(200).json(ref);
    } catch (error) {
        console.error(error);
        next(error);
    }
};