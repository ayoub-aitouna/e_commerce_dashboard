import { Request, Response, NextFunction } from "express";
import db from "../models";
import { Op } from "sequelize";
import { IpTvType } from "../models/Atterbuites/Product";
import { PurchasesAttributes } from "../models/Atterbuites/Purchases";
interface DateStatic {
  Total: number;
  Count: number;
}

const CalculatByQuery = async (query: any, referenceId: number | undefined = undefined) => {
  let Total = 0;
  const lastMonthPurchases: PurchasesAttributes[] | any =
    await db.purchases.findAll({
      include: [
        {
          model: db.product,
          required: true,
          where: query,
          include: [
            {
              model: db.reference,
              required: true,
              where: referenceId ? { id: referenceId } : {},
            }
          ]
        }
      ]
    });

  for (const purchase of lastMonthPurchases) {
    console.log(purchase.product.reference?.basic_price, purchase.product.reference?.premuim_price, purchase.product.reference?.gold_price);
    switch (purchase.product.type) {
      case IpTvType.Basic:
        Total += purchase.product.reference?.basic_price || 0;
        break;
      case IpTvType.Premium:
        Total += purchase.product.reference?.premuim_price || 0;
        break;
      case IpTvType.Gold:
        Total += purchase.product.reference?.gold_price || 0;
        break;
      case IpTvType.Elit:
        Total += purchase.product.reference?.elit_price || 0;
        break;
    }
  }
  return {
    Total: Total,
    Count: lastMonthPurchases.length
  } as DateStatic;
};

export const GetStatics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const referenceId = req.query.referenceId;

  try {
    const TodaysStatics = await CalculatByQuery({
      solded_at: {
        [Op.gt]: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    }, referenceId ? parseInt(referenceId as string) : undefined);

    let thisMonth = await CalculatByQuery({
      solded_at: {
        [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    }, referenceId ? parseInt(referenceId as string) : undefined);

    let count = await db.product.count({
      where: {
        sold: false,
      },
      include: [
        {
          model: db.reference,
          required: true,
          where: referenceId ? { id: referenceId } : {},
        }
      ]
    });

    return res.status(200).json({
      todaysTotalRevenue: TodaysStatics.Total,
      thisMonthTotalRevenue: thisMonth.Total,
      AverageOrderRevenueToday: TodaysStatics.Count !== 0 ? (TodaysStatics.Total / TodaysStatics.Count).toFixed(2) : 0,
      TotalAvailableProducts: count,
    });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

export const GetWeekStatics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const referenceId = req.query.referenceId;
  // Get the date one week ago
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  let dayOfWeekFunction;
  if (db.sequelize.getDialect() === "postgres") {
    dayOfWeekFunction = db.sequelize.fn(
      "EXTRACT",
      db.sequelize.literal("DOW FROM created_at")
    );
  } else if (db.sequelize.getDialect() === "mysql") {
    dayOfWeekFunction = db.sequelize.fn(
      "DAYOFWEEK",
      db.sequelize.col("`purchases`.`created_at`")
    );
  } else {
    throw new Error("Unsupported database dialect");
  }

  try {
    const counts = await db.purchases.findAll({
      attributes: [
        [db.sequelize.fn("COUNT", "*"), "count"],
        [dayOfWeekFunction, "dayOfWeek"],
      ],
      where: {
        created_at: {
          [Op.gte]: oneWeekAgo,
        },
      },
      group: [dayOfWeekFunction],
      raw: true,
      include: [
        {
          model: db.product,
          required: true,
          attributes: ["referenceId"],
          where: referenceId ? { referenceId: req.query.referenceId } : {},
        }
      ]
    });
    const daysOfWeek = [0, 0, 0, 0, 0, 0, 0];
    counts.forEach((count: any) => {
      daysOfWeek[count.dayOfWeek as number - 1] =
        parseInt(count.count as string) || 0;
    });
    const today = daysOfWeek[new Date().getDay()];
    return res.status(200).json({ daysOfWeek, today });
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};

export const GetYearStatics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const referenceId = req.query.referenceId;
  // Get the date one year ago
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  let monthFunction;
  if (db.sequelize.getDialect() === "postgres") {
    monthFunction = db.sequelize.fn(
      "EXTRACT",
      db.sequelize.literal("MONTH FROM `purchases`.`created_at`")
    );
  } else if (db.sequelize.getDialect() === "mysql") {
    monthFunction = db.sequelize.fn("MONTH", db.sequelize.col("`purchases`.`created_at`"));
  } else {
    throw new Error("Unsupported database dialect");
  }

  try {
    const counts = await db.purchases.findAll({
      attributes: [
        [db.sequelize.fn("COUNT", "*"), "count"],
        [monthFunction, "month"],
      ],
      where: {
        created_at: {
          [Op.gte]: oneYearAgo,
        },
      },
      group: [monthFunction],
      raw: true,
      include: [
        {
          model: db.product,
          required: true,
          attributes: ["referenceId"],
          where: referenceId ? { referenceId: req.query.referenceId } : {},
        }
      ]
    });
    const monthsOfYear = Array(12).fill(0);
    counts.forEach((count: any) => {
      monthsOfYear[(count.month as number) - 1] =
        parseInt(count.count as string) || 0;
    });
    const currentMonthSells = monthsOfYear[new Date().getMonth()];
    return res.status(200).json({ monthsOfYear, currentMonthSells });
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};

export const GetLatestPurchases = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const referenceId = req.query.referenceId;
  try {
    const purchases = await db.purchases.findAll({
      include: [
        {
          model: db.costumers,
          attributes: ["Email"],
        },
        {
          model: db.product,
          where: referenceId ? { referenceId: req.query.referenceId } : {},
          attributes: ["type", "referenceId"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: 25,
    });

    const result = purchases.map((purchase: any) => ({
      email: purchase.costumer.Email,
      type: purchase.product.type,
      purchaseDate: purchase.created_at,
    }));

    return res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};