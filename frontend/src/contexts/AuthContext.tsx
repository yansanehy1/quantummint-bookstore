import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService } from '../api/services/authService';
import type { User } from '../types/types';
import type { LoginRequest, RegisterRequest } from '../api/services/authService';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginRequest) => {
        setIsLoading(true);
        try {
            const { user: userData } = await authService.login(credentials);
            setUser(userData);
        } catch (error) {
            setIsLoading(false);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterRequest) => {
        setIsLoading(true);
        try {
            const { user: userData } = await authService.register(data);
            setUser(userData);
        } catch (error) {
            setIsLoading(false);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!user,
                user,
                isLoading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
