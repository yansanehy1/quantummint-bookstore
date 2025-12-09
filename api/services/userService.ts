import { userClient } from '../client';
import type { User, LoginRequest, RegisterRequest } from '../../types/api';

export const userService = {
    /**
     * Register a new user
     */
    async register(data: RegisterRequest): Promise<User> {
        return userClient.post<User>('/users', data);
    },

    /**
     * Login user (mock - actual endpoint TBD)
     */
    async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
        // Note: Update endpoint when backend auth is implemented
        return userClient.post('/auth/login', credentials);
    },

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<User> {
        return userClient.get<User>(`/users/${id}`);
    },

    /**
     * Get current user profile
     */
    async getCurrentUser(): Promise<User> {
        return userClient.get<User>('/users/me');
    },

    /**
     * Update user profile
     */
    async updateProfile(id: string, data: Partial<User>): Promise<User> {
        return userClient.put<User>(`/users/${id}`, data);
    },
};
