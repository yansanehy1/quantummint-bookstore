import { authAPI } from '../../utils/api';
import type { User } from '../../types/types';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'seller';
}

export const authService = {
    async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
        const data = await authAPI.login(credentials.email, credentials.password);
        return { user: data.user as User, token: data.token };
    },

    async register(data: RegisterRequest): Promise<{ user: User; token: string }> {
        const result = await authAPI.register({
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
        });
        return { user: result.user as User, token: result.token };
    },

    async logout(): Promise<void> {
        await authAPI.logout();
    },

    getCurrentUser(): User | null {
        return authAPI.getCurrentUser() as User | null;
    },

    isAuthenticated(): boolean {
        return authAPI.isAuthenticated();
    },
};
