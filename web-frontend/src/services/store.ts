// Mock user store - replace with actual state management
import { User, Book, AppSystemSettings } from '../../../types';

let currentUser: User | null = {
    id: '1',
    name: 'Demo User',
    role: 'LEARNER' as any,
    avatarUrl: 'https://ui-avatars.com/api/?name=Demo+User',
    email: 'demo@quantummint.net',
    walletBalance: {
        usd: 50.00,
        sll: 825000
    }
};

let subscribers: Array<() => void> = [];

export function getCurrentUser(): User | null {
    return currentUser;
}

export function setCurrentUser(user: User | null) {
    currentUser = user;
    notifySubscribers();
}

export function login(email: string, password: string) {
    // Mock login
    currentUser = {
        id: '1',
        name: 'Demo User',
        role: 'LEARNER' as any,
        avatarUrl: 'https://ui-avatars.com/api/?name=Demo+User',
        email,
        walletBalance: {
            usd: 50.00,
            sll: 825000
        }
    };
    notifySubscribers();
}

export function logout() {
    currentUser = null;
    notifySubscribers();
}

export function subscribe(callback: () => void) {
    subscribers.push(callback);
    return () => {
        subscribers = subscribers.filter(sub => sub !== callback);
    };
}

export function updateWalletBalance(usd: number, sll: number) {
    if (currentUser) {
        currentUser.walletBalance = { usd, sll };
        notifySubscribers();
    }
}

function notifySubscribers() {
    subscribers.forEach(callback => callback());
}

// Mock book store
const mockBooks: Book[] = [];

export function getBooks(): Book[] {
    return mockBooks;
}

export function addBook(book: Book) {
    mockBooks.push(book);
}

// Mock user management
const mockUsers: User[] = [];

export function getAllUsers(): User[] {
    return mockUsers;
}

export function updateUserStatus(userId: string, status: any) {
    // Mock update
}

export function deleteUser(userId: string) {
    // Mock delete
}

// Mock system settings
const systemSettings: AppSystemSettings = {
    siteName: 'QuantumMint Bookstore',
    maintenanceMode: false,
    allowRegistrations: true,
    withdrawalFeePercent: 5,
    exchangeRateUsdSll: 16500,
    enableAiFeatures: true,
    defaultTtsModel: 'gemini',
    paymentProviders: {
        stripe: true,
        orange: true,
        afri: true,
        qmoney: true
    }
};

export function getSystemSettings(): AppSystemSettings {
    return systemSettings;
}

export function updateSystemSettings(settings: Partial<AppSystemSettings>) {
    Object.assign(systemSettings, settings);
    notifySubscribers();
}

export function resetPlatformData() {
    // Mock reset
}
