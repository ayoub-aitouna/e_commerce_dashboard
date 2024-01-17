import create from 'zustand';
import axios from 'axios';
import { BaseUrl } from 'variables/Api';

export interface ReferenceAttributes {
    id: number;
    site: string;
    dns: string;
    basic_price: number;
    premuim_price: number;
    gold_price: number;
    created_at: Date;
    updated_at: Date;
}


type Store = {
    references: ReferenceAttributes[];
    getReference: () => Promise<void>;
    editReference: (reference: ReferenceAttributes) => Promise<void>;
    deleteReference: (id: number) => Promise<void>;
    addReference: (reference: ReferenceAttributes) => Promise<void>;
    searchReference: (searchQuery?: String) => Promise<void>;
};


export const referenceStore = create<Store>((set: any) => ({
    references: [] as ReferenceAttributes[],
    getReference: async () => {
        const { data } = await axios.get(
            `${BaseUrl}/reference/`);
        set({ references: data });

    },
    editReference: async (reference) => {
        await axios.put(`${BaseUrl}/reference/${reference.id}`, reference);
        set((state: Store) => {
            return {
                references: state.references.map((p) => {
                    return p.id === reference.id ? { ...p, ...reference } : p;
                }),
                Loading: false
            };
        });
    },
    deleteReference: async (id) => {
        await axios.delete(`${BaseUrl}/reference/${id}`);
        set((state: Store) => ({
            references: state.references.filter((reference) => reference.id !== id),
        }));

    },
    addReference: async (reference) => {
        const { data } = await axios.post(`${BaseUrl}/reference`, reference);
        console.log("data", data);
        console.log("result", data.result);
        set((state: Store) => ({ references: [...state.references, data] }));
    },
    searchReference: async (searchQuery?: String) => {
        const { data } = await axios.get(
            `${BaseUrl}/reference/Search/?searchQuery=${searchQuery}`);
        set({ references: data });
    },
}));