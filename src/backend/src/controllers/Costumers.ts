import { Request, Response, NextFunction } from 'express';
import { Parser } from 'json2csv';
import { CostumersAttrebues } from '@/models/Atterbuites/Costumers';
import { log } from 'console';
import path from 'path';
import db from '../models';
import fs from 'fs';
import { str2Boolean } from '../utils/str2Boolean';


export const ListCostumers = async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;
    let bought = str2Boolean(req.query.bought as string);
    let pendding = str2Boolean(req.query.pendding as string);

    let offset = (page - 1) * limit;
    try {
        const constumers = await db.costumers.findAll({
            limit: limit,
            offset: offset,
            where: {
                bought: bought,
                pendding: pendding
            },
        });
        res.status(200).json(constumers);
    } catch (error) {
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
        let bought = str2Boolean(req.query.bought as string);
        let pendding = str2Boolean(req.query.pendding as string);

        const json2csv = new Parser();
        const costumerInstances: CostumersAttrebues[] =
            await db.costumers.findAll({ where: { bought: bought, pendding: pendding } });
        if (!costumerInstances.length)
            return res.status(404).send({ message: 'Costumers not found' });

        // Map over the instances and get only the data values
        const costumers = costumerInstances.map((instance: any) => instance.dataValues);
        console.log(costumers)

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
