import create from "zustand";
import axios, { AxiosHeaders } from "axios";
import { BaseUrl, jwt_cockies_name, Jwt_Refresh_Cockies_Name } from "variables/Api";
import { IpTvType } from "./products";
import Cookies from 'universal-cookie';

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

const Config = () => {
  const cookies = new Cookies(null, { path: '/' });
  return {
    headers: {
      Authorization: `Bearer ${cookies.get(jwt_cockies_name)}`,
    },
  }
}

const MAxios = (Url: string, Body: any) => {
  const { data }: { data: IWeekState } = await axios.get(
    `${BaseUrl}/${endpoint}/week`, Config()
  );
}


export const StatisticsStore = create<Store>((set: any) => ({
  Statics: {} as IStatics,
  WeekState: { daysOfWeek: [] as number[], today: 0 } as IWeekState,
  YearState: {
    monthsOfYear: [] as number[],
    currentMonthSells: 0,
  } as IYearState,
  latestPurchases: [] as IPurchase[],
  getStats: async () => {
    const { data }: { data: IWeekState } = await axios.get(
      `${BaseUrl}/${endpoint}/`
    );
    console.log(data);
    set({ Statics: data });
  },
  getWeekSatate: async () => {
    const { data }: { data: IWeekState } = await axios.get(
      `${BaseUrl}/${endpoint}/week`, Config()
    );
    set({ WeekState: { daysOfWeek: data.daysOfWeek, today: data.today } });
  },
  getYearSatate: async () => {
    const { data }: { data: IWeekState } = await axios.get(
      `${BaseUrl}/${endpoint}/year`
    );
    set({ YearState: data });
  },
  getlatestPurchases: async () => {
    const { data }: { data: IWeekState } = await axios.get(
      `${BaseUrl}/${endpoint}/latest-purchases`
    );
    set({ latestPurchases: data });
  },
}));
