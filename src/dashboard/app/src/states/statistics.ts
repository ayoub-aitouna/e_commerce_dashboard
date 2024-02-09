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

export interface Filters {
  referenceId: number | null;
}

type Store = {
  Statics: IStatics;
  WeekState: IWeekState;
  YearState: IYearState;
  latestPurchases: IPurchase[];
  getStats: (filters: Filters) => Promise<void>;
  getWeekSatate: (filters: Filters) => Promise<void>;
  getYearSatate: (filters: Filters) => Promise<void>;
  getlatestPurchases: (filters: Filters) => Promise<void>;
};


const GetFilters = (filters: Filters) => {
  let result = '?';
console.log("filters", filters);
  if (filters.referenceId !== null && filters.referenceId !== undefined)
    result += `referenceId=${filters.referenceId}`;
  return result;
};

export const StatisticsStore = create<Store>((set: any) => ({
  Statics: {} as IStatics,
  WeekState: { daysOfWeek: [] as number[], today: 0 } as IWeekState,
  YearState: {
    monthsOfYear: [] as number[],
    currentMonthSells: 0,
  } as IYearState,
  latestPurchases: [] as IPurchase[],
  getStats: async (filters: Filters) => {
    await Wrapper(async () => {
      const { data }: { data: IStatics } = await axios.get(
        `${BaseUrl}/${endpoint}/${GetFilters(filters)}`,
        Config()
      );
      set({ Statics: data });
    });
  },
  getWeekSatate: async (filters: Filters) => {
    await Wrapper(async () => {
      const { data }: { data: IWeekState } = await axios.get(
        `${BaseUrl}/${endpoint}/week${GetFilters(filters)}`,
        Config()
      );
      set({ WeekState: { daysOfWeek: data.daysOfWeek, today: data.today } });
    });
  },
  getYearSatate: async (filters: Filters) => {
    await Wrapper(async () => {
      const { data }: { data: IWeekState } = await axios.get(
        `${BaseUrl}/${endpoint}/year${GetFilters(filters)}`, Config()
      );
      set({ YearState: data });
    });

  },
  getlatestPurchases: async (filters: Filters) => {
    await Wrapper(async () => {
      console.log("getlatestPurchases", Config());
      const { data }: { data: IWeekState } = await axios.get(
        `${BaseUrl}/${endpoint}/latest-purchases${GetFilters(filters)}`, Config()
      );
      set({ latestPurchases: data });
    });
  },
}));
