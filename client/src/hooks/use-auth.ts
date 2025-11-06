import { create } from 'zustand';
import { pb } from "@/lib/pocketbase";
import { getCurrentUser, type AuthUser, login as loginApi, logout as logoutApi } from '@/api/auth';

interface AuthState {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isInitialized: boolean;
    login: (identifier: string, password: string) => Promise<void>;
    logout: () => void;
    _refreshUser: () => void;
    _setInitialized: (value: boolean) => void;
}

export const useAuth = create<AuthState>((set) => ({
    user: getCurrentUser(),
    isLoading: false,
    isAuthenticated: !!getCurrentUser(),
    isInitialized: false,

    _refreshUser: () => {
        const currentUser = getCurrentUser();
        set({
            user: currentUser,
            isAuthenticated: !!currentUser,
        });
    },

    _setInitialized: (value: boolean) => set({ isInitialized: value }),

    login: async (identifier, password) => {
        set({ isLoading: true });
        try {
            const authUser = await loginApi(identifier, password);
            set({ user: authUser, isAuthenticated: true });
        } catch (error) {
            console.error('Login failed in store:', error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: () => {
        logoutApi();
        set({ user: null, isAuthenticated: false });
    },
}));

const initializeAuthListener = () => {
    const { _refreshUser } = useAuth.getState();
    pb.authStore.onChange(() => {
        _refreshUser();
    });
    _refreshUser();

};

initializeAuthListener();