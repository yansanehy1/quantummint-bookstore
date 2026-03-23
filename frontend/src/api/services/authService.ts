import { userClient } from '../client';
import type { User, LoginRequest, RegisterRequest } from '../../types/api';

export const authService = {
    /**
     * Login user
     */
    async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
        const response = await userClient.post<{ user: User; token: string }>('/auth/login', credentials);
        if (response.token) {
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
    },

    /**
     * Register new user
     */
    async register(data: RegisterRequest): Promise<{ user: User; token: string }> {
        const response = await userClient.post<{ user: User; token: string }>('/auth/register', data);
        if (response.token) {
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    },

    /**
     * Get current user from storage
     */
    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    /**
     * Check if authenticated
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('auth_token');
    }
};
