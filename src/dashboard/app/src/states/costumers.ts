import create from 'zustand';
import axios from 'axios';
import { BaseUrl } from 'variables/Api';
import Costumers from 'views/admin/dataTables/Costumers';

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
        result += `bought=${filters.bought}&`;
    if (filters.pending !== null && filters.pending !== undefined)
        result += `pendding=${filters.pending}&`;
    if (filters.page !== null && filters.page !== undefined)
        result += `page=${filters.page}`;
    return result;
};


export const costumerStore = create<Store>((set: any) => ({
    costumers: [] as CostumersAttrebues[],
    getCostumers: async (filters: Filters) => {
        const { data } = await axios.get(
            `${BaseUrl}/costumers/${GetFilters(filters)}`);
        set({ costumers: data });

    },
    downloadCostumers: async (filters: Filters) => {
        const { data } = await axios.get(
            `${BaseUrl}/costumers/save/${GetFilters(filters)}`);

        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${new Date().getTime()}-Customers-List.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
}));