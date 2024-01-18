import create from 'zustand';
import axios from 'axios';
import { BaseUrl } from 'variables/Api';
import { stat } from 'fs';

export enum IpTvType {
    Basic = "Basic",
    Gold = "Gold",
    Premium = "Premium",
}

export interface ProductAttributes {
    id?: number;
    iptv_url: string;
    type: IpTvType;
    sold: boolean;
    pendding: boolean;
    pendding_at?: Date;
    solded_at?: Date;
    created_at?: Date;
    updated_at?: Date;
    referenceId?: number;
}

export interface Filters {
    sold: boolean | null;
    type: IpTvType | null;
    page: number;
}

type Store = {
    products: ProductAttributes[];
    getProducts: (filters?: Filters) => Promise<void>;
    editProduct: (product: ProductAttributes) => Promise<void>;
    updateDns: (newDns: string) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    addProduct: (product: ProductAttributes) => Promise<void>;
    searchProduct: (searchQuery?: String) => Promise<void>;
};

const GetFilters = (filters: Filters) => {
    let result = '?';
    if (filters.type !== null && filters.type !== undefined)
        result += `type=${filters.type}&`;
    if (filters.sold !== null && filters.sold !== undefined)
        result += `sold=${filters.sold}&`;
    if (filters.page !== null && filters.page !== undefined)
        result += `page=${filters.page}`;
    return result;
};


export const productStore = create<Store>((set) => ({
    products: [],
    error: null,
    Loading: false,
    getProducts: async (filters: Filters) => {
        const { data } = await axios.get(
            `${BaseUrl}/product/${GetFilters(filters)}`);
        set({ products: data });
    },
    editProduct: async (product) => {
        await axios.patch(`${BaseUrl}/product/`, product);
        set((state) => {
            return {
                products: state.products.map((p) => {
                    return p.id === product.id ? { ...p, ...product } : p;
                }),
                Loading: false
            };
        });
    },
    updateDns: async (newDns) => {
        await axios.get(`${BaseUrl}/product/UpdateUrl/?UpdatedDns=${newDns}`);
        set((state: any) => {
            return {
                products: state.products.map((p: any) => {
                    const url = new URL(p.iptv_url);
                    const newurl = new URL(newDns);
                    url.hostname = newurl.hostname;
                    url.port = newurl.port;
                    url.protocol = newurl.protocol;
                    p.iptv_url = url.toString();
                    return p;
                })
            };
        });
    },
    deleteProduct: async (id) => {
        await axios.delete(`${BaseUrl}/product/?id=${id}`);
        set((state) => ({
            products: state.products.filter((product) => product.id !== id),
        }));

    },
    addProduct: async (product) => {
        const { data } = await axios.post(`${BaseUrl}/product`, product);
        set((state) => ({ products: [...state.products, data.result] }));
    },
    searchProduct: async (searchQuery?: String) => {
        const { data } = await axios.get(
            `${BaseUrl}/product/Search/?searchQuery=${searchQuery}`);
        set({ products: data });
    },
}));