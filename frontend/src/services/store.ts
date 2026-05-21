import { CURRENT_USER, MOCK_BOOKS } from '../constants';

export const getCurrentUser = () => {
    return CURRENT_USER;
};

export const updateWalletBalance = (amount: number, currency: string) => {
    if (currency === 'USD') {
        CURRENT_USER.walletBalance.usd += amount;
    } else {
        CURRENT_USER.walletBalance.sll += amount;
    }
    console.log(`[Mock] Updated balance: ${CURRENT_USER.walletBalance.usd} USD / ${CURRENT_USER.walletBalance.sll} SLL`);
};

export interface AppSystemSettings {
    siteName: string;
    maintenanceMode: boolean;
    allowRegistrations: boolean;
    withdrawalFeePercent: number;
    exchangeRateUsdSll: number;
    paymentProviders: {
        stripe: boolean;
        orange: boolean;
        afri: boolean;
        qmoney: boolean;
    };
    defaultTtsModel: string;
    enableAiFeatures: boolean;
}

const MOCK_SETTINGS: AppSystemSettings = {
    siteName: "QuantumMint Bookstore",
    maintenanceMode: false,
    allowRegistrations: true,
    withdrawalFeePercent: 5,
    exchangeRateUsdSll: 23000,
    paymentProviders: {
        stripe: true,
        orange: true,
        afri: true,
        qmoney: true
    },
    defaultTtsModel: "gemini-2.5-flash-preview-tts",
    enableAiFeatures: true
};

export const getSystemSettings = () => MOCK_SETTINGS;
export const updateSystemSettings = (s: AppSystemSettings) => { Object.assign(MOCK_SETTINGS, s); };
export const resetPlatformData = () => { console.log("Platform reset"); };
export const subscribe = (cb: () => void) => { return () => { }; };

export const getBooks = () => MOCK_BOOKS;
export const getAllUsers = () => {
    return [
        { id: 'u1', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN', status: 'Active', avatarUrl: 'https://i.pravatar.cc/150?u=u1' },
        { id: 'u2', name: 'John Doe', email: 'john@example.com', role: 'LEARNER', status: 'Active', avatarUrl: 'https://i.pravatar.cc/150?u=u2' },
        { id: 'u3', name: 'Jane Smith', email: 'jane@example.com', role: 'EDUCATOR', status: 'Pending', avatarUrl: 'https://i.pravatar.cc/150?u=u3' },
    ];
};
export const updateUserStatus = (id: string, s: string) => { console.log(`User ${id} status -> ${s}`); };
export const deleteUser = (id: string) => { console.log(`Deleted user ${id}`); };

export { MOCK_BOOKS };
