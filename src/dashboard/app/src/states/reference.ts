import create from 'zustand';
import axios from 'axios';
import { BaseUrl } from 'variables/Api';
import { Config, Wrapper } from "./Token";

export interface ReferenceAttributes {
    id: number;
    site: string;
    dns: string;
    basic_price: number;
    premuim_price: number;
    gold_price: number;
    elit_price: number;
    created_at: Date;
    updated_at: Date;
}

export interface IreferenceSite {
    id: number;
    site: string;
}

type Store = {
    references: ReferenceAttributes[];
    referencesSites: IreferenceSite[];
    getReference: () => Promise<void>;
    editReference: (reference: ReferenceAttributes) => Promise<void>;
    deleteReference: (id: number) => Promise<void>;
    addReference: (reference: ReferenceAttributes) => Promise<void>;
    searchReference: (searchQuery?: String) => Promise<void>;
    getReferenceSite: () => Promise<void>;
};


export const referenceStore = create<Store>((set: any) => ({
    references: [] as ReferenceAttributes[],
    referencesSites: [] as IreferenceSite[],
    getReference: async () => {
        await Wrapper(async () => {
            const { data } = await axios.get(
                `${BaseUrl}/reference/`, Config());
            set({ references: data });
        });
    },
    editReference: async (reference) => {
        await Wrapper(async () => {
            await axios.put(`${BaseUrl}/reference/${reference.id}`,
                reference, Config());
            set((state: Store) => {
                return {
                    references: state.references.map((p) => {
                        return p.id === reference.id ? { ...p, ...reference } : p;
                    }),
                };
            });
        });
    },
    
    deleteReference: async (id) => {
        await Wrapper(async () => {
            await axios.delete(`${BaseUrl}/reference/${id}`, Config());
            set((state: Store) => ({
                references: state.references.filter((reference) => reference.id !== id),
            }));
        });
    },
    addReference: async (reference) => {
        await Wrapper(async () => {
            const { data } = await axios.post(`${BaseUrl}/reference`, reference, Config());
            console.log("data", data);
            console.log("result", data.result);
            set((state: Store) => ({ references: [...state.references, data] }));
        });
    },
    searchReference: async (searchQuery?: String) => {
        await Wrapper(async () => {
            const { data } = await axios.get(
                `${BaseUrl}/reference/Search/?searchQuery=${searchQuery}`, Config());
            set({ references: data });
        });
    },
    getReferenceSite: async () => {
        await Wrapper(async () => {
            const { data } = await axios.get(
                `${BaseUrl}/reference/site`, Config());
            set({ referencesSites: data });
        });
    }
}));