import { create } from 'zustand'

interface User {
    email: string;
    password: string;
    AccessToken?: string;
    RefreshToken?: string;
}

// const useUserStore = create((set: any) => ({
//     User: null,
//     SetUser: (user: User) => set((state: User) => ({ User: state })),
//     RemoveUser: () => set({ User: null }),
// }))

const useUserStore = create((set: any) => ({
    User: null,
    SetUser: (user: User) => set(() => ({ User: user })),
    RemoveUser: () => set({ User: null }),
}))

export { useUserStore, type User }