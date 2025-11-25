export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: 'admin' | 'seller' | 'user';
    passwordHash: string;
    createdAt?: Date;
    updatedAt?: Date;
}
