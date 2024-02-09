import { Request, Response, NextFunction } from 'express';
import { Parser } from 'json2csv';
import { CostumersAttrebues } from '@/models/Atterbuites/Costumers';
import { log } from 'console';
import path from 'path';
import db from '../models';
import fs from 'fs';
import { BadRequestError } from '../errors';
import { Op } from 'sequelize';


function generateWhereClause(bought: any, pendding: any, referenceSite: any) {
    let where = {} as any;

    if (bought !== undefined && bought !== null)
        where.bought = bought === 'true' ? 1 : 0;

    if (pendding !== undefined && pendding !== null)
        where.pendding = pendding === 'true' ? 1 : 0;
    if (referenceSite !== undefined && referenceSite !== null && referenceSite !== '')
        where.referenceSite = referenceSite;

    console.log("Costumers List Filters : ", where);
    return where;
}

//referenceSite
export const ListCostumers = async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const bought: any = req.query.bought;
    const pendding: any = req.query.pendding;
    const referenceSite: any = req.query.referenceSite;
    let offset = (page - 1) * limit;

    try {
        const props: any = {};
        props.where = generateWhereClause(bought, pendding, referenceSite);
        props.limit = limit;
        props.offset = offset;
        const costumers = await db.costumers.findAll(props);
        res.status(200).json(costumers);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const SenDownloadableFile = (res: Response, filename: string) => {
    return new Promise((resolve, reject) => {
        res.download(filename, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(filename);
            }
        });
    });
}



export const SaveCostumers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bought: any = req.query.bought;
        const pendding: any = req.query.pendding;


        const json2csv = new Parser();
        const costumerInstances: CostumersAttrebues[] =
            await db.costumers.findAll({ where: generateWhereClause(bought, pendding, undefined) });

        if (!costumerInstances.length)
            throw new BadRequestError({ code: 404, message: 'Costumers not found', logging: false })

        const costumers = costumerInstances.map((instance: any) => instance.dataValues);
        const csv = json2csv.parse(costumers);
        const directoryPath = path.join(__dirname, '../../public/csv_files/');
        const filename = path.join(directoryPath, 'customers.csv');

        if (!fs.existsSync(directoryPath))
            fs.mkdirSync(directoryPath, { recursive: true });
        fs.writeFileSync(filename, csv);

        await SenDownloadableFile(res, filename);

        log(`File ${filename} sent`);
        return;
    } catch (error) {
        next(error);
    }
};

export const addCostumer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, referenceSite, language } = req.body;
        if (!email || !referenceSite || !language)
            throw new BadRequestError({ code: 404, message: 'Invalide Body Prop', logging: false })
        const costumer = await db.costumers.create({
            Email: email,
            referenceSite: referenceSite,
            language: language,
            bought: false,
            pendding: false,
            bought_at: null,
            pendding_at: null,
        });
        res.status(200).json(costumer);
    } catch (error) {
        next(error);
    }
}


export const SearchCostumer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { searchQuery } = req.query;
        const costumers = await db.costumers.findAll({
            where: searchQuery ? {
                [Op.or]: [
                    { Email: { [Op.like]: `%${searchQuery}%` } },
                    // { referenceSite: { [Op.like]: `%${searchQuery}%` } },
                    { language: { [Op.like]: `%${searchQuery}%` } }
                ]
            } : {}
        });
        res.status(200).json(costumers);
    } catch (error) {
        next(error);
    }
}