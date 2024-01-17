import create from "zustand";
import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
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

const Config = async () => {
  const cookies = new Cookies(null, { path: '/' });
  const token = cookies.get(jwt_cockies_name);

  if (token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return {};
};


const ResetToken = async () => {
  const cookies = new Cookies(null, { path: '/' });
  const token = cookies.get(jwt_cockies_name);
  const refreshToken = cookies.get(Jwt_Refresh_Cockies_Name);

  if (token && refreshToken) {
    const { data }: { data: { token: string, refreshToken: string } } = await axios.post(
      `${BaseUrl}/auth/refresh-token`,
      { refreshToken }
    );
    cookies.set(jwt_cockies_name, data.token, { path: '/' });
    cookies.set(Jwt_Refresh_Cockies_Name, data.refreshToken, { path: '/' });
  }
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
    const response = await axios.get(
      `${BaseUrl}/${endpoint}/`,
      {
        headers: {
          Authorization: `Bearer ${new Cookies(null, { path: '/' }).get(jwt_cockies_name)}`,
        },
      }
    );
    const { data }: { data: IWeekState } = response;;
    if (response.status === 403) {
      console.log("403");
      await ResetToken();
      // set.getStats();
    }
    set({ Statics: data });
  },
  getWeekSatate: async () => {
    const { data }: { data: IWeekState } = await axios.get(
      `${BaseUrl}/${endpoint}/week`,
      {
        headers: {
          Authorization: `Bearer ${new Cookies(null, { path: '/' }).get(jwt_cockies_name)}`,
        },
      }
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
