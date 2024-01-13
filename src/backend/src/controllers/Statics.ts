import { Request, Response, NextFunction } from "express";
import db from "../models";
import { Op } from 'sequelize';
import { ProductAttributes, IpTvType } from "../models/Atterbuites/Product";


const CalculatByQuery = async (query: any) => {
    let Total = 0;

    let Prices = new Map<string, number>(
        [[IpTvType.Basic, 10],
        [IpTvType.Premium, 30]],
    );
    const lastMonthProductsInserts: ProductAttributes[]
        = await db.product.findAll({ where: query, });
    for (const product of lastMonthProductsInserts)
        Total += Prices.get(product.type) || 0;
    return (Total);
};

export const GetMonthStatics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lastMonthStartDate = new Date();
        lastMonthStartDate.setMonth(lastMonthStartDate.getMonth() - 1);
        let SpentMoney = await CalculatByQuery({
            created_at: {
                [Op.gte]: lastMonthStartDate,
            },
        });

        let sellsMoney = await CalculatByQuery({
            solded_at: {
                [Op.gte]: lastMonthStartDate,
            },
        });

        let count = await db.product.count({
            where: {
                sold: false
            }
        });

        return res.status(200).json(
            {
                SpentMoney: SpentMoney,
                sellsMoney: sellsMoney,
                Revenue: sellsMoney - SpentMoney,
                TotalAvailableProducts: count
            });
    } catch (error: any) {
        next(error);
    }


};