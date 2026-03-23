// Authentication Service
// Handles user authentication, registration, and session management

import api from '../utils/api';
import type { User } from '../types';

class AuthService {
    private currentUser: User | null = null;

    /**
     * Login user with email and password
     */
    async login(email: string, password: string): Promise<User> {
        try {
            const { user, token } = await api.auth.login(email, password);
            this.currentUser = user;
            this.broadcastAuthChange();
            return user;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    /**
     * Register new user
     */
    async register(userData: {
        fullName: string;
        email: string;
        password: string;
        role: 'learner' | 'creator';
    }): Promise<User> {
        try {
            const { user, token } = await api.auth.register(userData);
            this.currentUser = user;
            this.broadcastAuthChange();
            return user;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }

    /**
     * Logout current user
     */
    async logout(): Promise<void> {
        await api.auth.logout();
        this.currentUser = null;
        this.broadcastAuthChange();
    }

    /**
     * Get current authenticated user
     */
    getCurrentUser(): User | null {
        if (!this.currentUser) {
            this.currentUser = api.auth.getCurrentUser();
        }
        return this.currentUser;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return api.auth.isAuthenticated();
    }

    /**
     * Check if user has specific role
     */
    hasRole(role: 'learner' | 'creator' | 'support' | 'admin'): boolean {
        const user = this.getCurrentUser();
        return user?.role === role;
    }

    /**
     * Check if user is a creator
     */
    isCreator(): boolean {
        return this.hasRole('creator');
    }

    /**
     * Check if user is an admin
     */
    isAdmin(): boolean {
        return this.hasRole('admin');
    }

    /**
     * Broadcast authentication state change
     */
    private broadcastAuthChange(): void {
        window.dispatchEvent(new CustomEvent('auth-change', {
            detail: { user: this.currentUser }
        }));
    }

    /**
     * Listen to authentication changes
     */
    onAuthChange(callback: (user: User | null) => void): () => void {
        const handler = (event: Event) => {
            const customEvent = event as CustomEvent;
            callback(customEvent.detail.user);
        };

        window.addEventListener('auth-change', handler);

        // Return cleanup function
        return () => window.removeEventListener('auth-change', handler);
    }
}

export const authService = new AuthService();
export default authService;
