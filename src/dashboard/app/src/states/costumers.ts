import create from 'zustand';
import axios from 'axios';
import { BaseUrl } from 'variables/Api';

export interface CostumersAttrebues {
	Email: string;
	bought: boolean;
	bought_at: Date;
	pendding: boolean;
	pendding_at: Date;
	created_at: Date;
}

export interface Filters {
    bought: boolean | null;
    pending: boolean | null;
    page: number;
}

type Store = {
    costumers: CostumersAttrebues[];
    getCostumers: (filters?: Filters) => Promise<void>;
    downloadCostumers: (filters?: Filters) => Promise<void>;
};

const GetFilters = (filters: Filters) => {
    let result = '?';
    if (filters.bought !== null && filters.bought !== undefined)
        result += `type=${filters.bought}&`;
    if (filters.pending !== null && filters.pending !== undefined)
        result += `sold=${filters.pending}&`;
    if (filters.page !== null && filters.page !== undefined)
        result += `page=${filters.page}`;
    return result;
};


export const costumerStore = create<Store>((set : any) => ({
    costumers: [] as CostumersAttrebues[],
    getCostumers: async (filters: Filters) => {
        const { data } = await axios.get(
            `${BaseUrl}/product/${GetFilters(filters)}`);
        set({ products: data });
    },
    downloadCostumers: async (filters: Filters) => {
        const { data } = await axios.get(
            `${BaseUrl}/product/${GetFilters(filters)}`);
    },
}));