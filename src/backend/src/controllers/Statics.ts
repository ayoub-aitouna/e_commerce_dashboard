import { Request, Response, NextFunction } from "express";
import db from "../models";
import { Op } from "sequelize";
import { ProductAttributes, IpTvType } from "../models/Atterbuites/Product";

const CalculatByQuery = async (query: any) => {
  let Total = 0;
  const lastMonthProductsInserts: ProductAttributes[] =
    await db.product.findAll({
      where: query,
      include: [
        {
          model: db.reference,
          required: true,
        }
      ]
    });

  for (const product of lastMonthProductsInserts) {
    console.log(product.reference?.basic_price, product.reference?.premuim_price, product.reference?.gold_price);
    switch (product.type) {
      case IpTvType.Basic:
        Total += product.reference?.basic_price || 0;
        break;
      case IpTvType.Premium:
        Total += product.reference?.premuim_price || 0;
        break;
      case IpTvType.Gold:
        Total += product.reference?.gold_price || 0;
        break;
    }
  }
  return Total;
};

const CalculatByQueryAvg = async (query: any) => {
  let Total = 0;


  const lastMonthProductsInserts: ProductAttributes[] =
    await db.product.findAll({
      where: query,
      include: [
        {
          model: db.reference,
          required: true,
        }
      ]
    });
  if (lastMonthProductsInserts.length === 0)
    return (0);
  for (const product of lastMonthProductsInserts) {
    console.log(product.reference?.basic_price, product.reference?.premuim_price, product.reference?.gold_price);
    switch (product.type) {
      case IpTvType.Basic:
        Total += product.reference?.basic_price || 0;
        break;
      case IpTvType.Premium:
        Total += product.reference?.premuim_price || 0;
        break;
      case IpTvType.Gold:
        Total += product.reference?.gold_price || 0;
        break;
    }
  }
  return (Total / lastMonthProductsInserts.length).toFixed(1);

};

const GetSDate = (NumberOfDays: number, NumberOMonths: number) => {
  const date = new Date();
  date.setDate(date.getDate() - NumberOfDays);
  date.setMonth(date.getMonth() - NumberOMonths);
  return date;
};

export const GetStatics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let todays = await CalculatByQuery({
      solded_at: {
        [Op.gte]: GetSDate(1, 0),
      },
    });
    let todaysAvg = await CalculatByQueryAvg({
      solded_at: {
        [Op.gte]: GetSDate(1, 0),
      },
    });

    let thisMonth = await CalculatByQuery({
      solded_at: {
        [Op.gte]: GetSDate(0, 1),
      },
    });

    let count = await db.product.count({
      where: {
        sold: false,
      },
    });

    return res.status(200).json({
      todaysTotalRevenue: todays,
      thisMonthTotalRevenue: thisMonth,
      AverageOrderRevenueToday: todaysAvg,
      TotalAvailableProducts: count,
    });
  } catch (error: any) {
    res.status(500).json(error);
  }
};

export const GetWeekStatics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      db.sequelize.col("created_at")
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
    });
    const daysOfWeek = [0, 0, 0, 0, 0, 0, 0];
    counts.forEach((count: any) => {
      daysOfWeek[count.dayOfWeek as number] =
        parseInt(count.count as string) || 0;
    });
    const today = daysOfWeek[new Date().getDay()];
    return res.status(200).json({ daysOfWeek, today });
  } catch (error: any) {
    console.error(error);
    res.status(500).json(error);
  }
};

export const GetYearStatics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get the date one year ago
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  let monthFunction;
  if (db.sequelize.getDialect() === "postgres") {
    monthFunction = db.sequelize.fn(
      "EXTRACT",
      db.sequelize.literal("MONTH FROM created_at")
    );
  } else if (db.sequelize.getDialect() === "mysql") {
    monthFunction = db.sequelize.fn("MONTH", db.sequelize.col("created_at"));
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
    res.status(500).json(error);
  }
};

export const GetLatestPurchases = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const purchases = await db.purchases.findAll({
      include: [
        {
          model: db.costumers,
          attributes: ["Email"],
        },
        {
          model: db.product,
          attributes: ["type"],
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
    res.status(500).json(error);
  }
};
