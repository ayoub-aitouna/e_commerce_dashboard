import create from "zustand";
import axios from "axios";
import { BaseUrl } from "variables/Api";
import { IpTvType } from "./products";
import { Config, Wrapper } from "./Token";

const endpoint = "statics";

export interface IWeekState {
  daysOfWeek: number[];
  today: number;
}

export interface IYearState {
  monthsOfYear: number[];
  currentMonthSells: number;
}

export interface IPurchase {
  email: string;
  type: IpTvType;
  purchaseDate: Date;
}

export interface IStatics {
  todaysTotalRevenue: number,
  thisMonthTotalRevenue: number,
  AverageOrderRevenueToday: number,
  TotalAvailableProducts: number

}


type Store = {
  Statics: IStatics;
  WeekState: IWeekState;
  YearState: IYearState;
  latestPurchases: IPurchase[];
  getStats: () => Promise<void>;
  getWeekSatate: () => Promise<void>;
  getYearSatate: () => Promise<void>;
  getlatestPurchases: () => Promise<void>;
};




export const StatisticsStore = create<Store>((set: any) => ({
  Statics: {} as IStatics,
  WeekState: { daysOfWeek: [] as number[], today: 0 } as IWeekState,
  YearState: {
    monthsOfYear: [] as number[],
    currentMonthSells: 0,
  } as IYearState,
  latestPurchases: [] as IPurchase[],
  getStats: async () => {
    await Wrapper(async () => {
      const { data }: { data: IStatics } = await axios.get(
        `${BaseUrl}/${endpoint}/`,
        Config()
      );
      set({ Statics: data });
    });
  },
  getWeekSatate: async () => {
    await Wrapper(async () => {
      const { data }: { data: IWeekState } = await axios.get(
        `${BaseUrl}/${endpoint}/week`,
        Config()
      );
      set({ WeekState: { daysOfWeek: data.daysOfWeek, today: data.today } });
    });
  },
  getYearSatate: async () => {
    await Wrapper(async () => {
      const { data }: { data: IWeekState } = await axios.get(
        `${BaseUrl}/${endpoint}/year`, Config()
      );
      set({ YearState: data });
    });

  },
  getlatestPurchases: async () => {
    await Wrapper(async () => {
      console.log("getlatestPurchases", Config());
      const { data }: { data: IWeekState } = await axios.get(
        `${BaseUrl}/${endpoint}/latest-purchases`, Config()
      );
      set({ latestPurchases: data });
    });
  },
}));
