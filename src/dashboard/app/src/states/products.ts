import create from 'zustand';
import axios from 'axios';
import { BaseUrl } from 'variables/Api';

export enum IpTvType {
    Basic = "basic",
    Premium = "premium",
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
}

export interface Filters {
    sold: boolean | null;
    type: IpTvType | null;
    page: number;
}

type Store = {
    products: ProductAttributes[];
    error: string | null;
    Loading: boolean;
    getProducts: (filters?: Filters) => Promise<void>;
    editProduct: (product: ProductAttributes) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    addProduct: (product: ProductAttributes) => Promise<void>;
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
        set({ error: null });
        set({ Loading: true });
        try {
            const { data } = await axios.get(
                `${BaseUrl}/product/${GetFilters(filters)}`);
            set({ products: data });
        } catch (error: any) {
            console.log("Error", error);
            set({ error: error.message });
        } finally {
            set({ Loading: false });
        }
    },
    editProduct: async (product) => {
        set({ error: null });
        set({ Loading: true });

        try {
            const { data } = await axios.patch(`${BaseUrl}/product/`, product);
            set((state) => ({
                products: state.products.map((p) =>
                    p.id === product.id ? { ...p, ...data } : p
                ),
            }));
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ Loading: false });
        }
    },
    deleteProduct: async (id) => {
        set({ error: null });
        set({ Loading: true });

        try {
            await axios.delete(`${BaseUrl}/product/${id}`);
            set((state) => ({
                products: state.products.filter((product) => product.id !== id),
            }));
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ Loading: false });
        }
    },
    addProduct: async (product) => {
        set({ error: null });
        set({ Loading: true });
        try {
            const { data } = await axios.post(`${BaseUrl}/product`, product);
            set((state) => ({ products: [...state.products, data] }));
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ Loading: false });
        }
    },
}));