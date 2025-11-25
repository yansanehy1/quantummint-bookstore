export type Role = 'user' | 'admin' | 'seller';
export type AuthUser = {
    id: number;
    role: Role;
    name?: string;
    email?: string;
    createdAt?: string | number | Date;
} | null;
export type AuthContextValue = {
    user: AuthUser;
    loading: boolean;
    setUser: (u: AuthUser) => void;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
};
export declare function AuthProvider({ children }: {
    children: React.ReactNode;
}): import("react").JSX.Element;
export declare function useAuthContext(): AuthContextValue;
