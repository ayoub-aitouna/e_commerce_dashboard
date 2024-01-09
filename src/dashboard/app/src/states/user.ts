import { create } from 'zustand'

interface User {
    email: string;
    password: string;
}

const useUserStore = create((set: any) => ({
    User: null,
    SetUser: () => set((state: User) => ({ User: state })),
    RemoveUser: () => set({ bears: 0 }),
}))


export { useUserStore, type User }