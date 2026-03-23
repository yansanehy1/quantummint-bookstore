import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export class ApiClient {
    private axiosInstance: AxiosInstance;

    constructor(baseURL: string) {
        this.axiosInstance = axios.create({
            baseURL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor - add auth token
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('auth_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - handle errors
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Token expired - clear auth and redirect to login
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                return Promise.reject(this.handleError(error));
            }
        );
    }

    private handleError(error: AxiosError): Error {
        if (error.response) {
            // Server responded with error
            const message = (error.response.data as any)?.error || error.response.statusText;
            return new Error(`API Error: ${message}`);
        } else if (error.request) {
            // Request made but no response
            return new Error('Network Error: No response from server');
        } else {
            // Request setup error
            return new Error(`Request Error: ${error.message}`);
        }
    }

    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.get<T>(url, config);
        return response.data;
    }

    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.post<T>(url, data, config);
        return response.data;
    }

    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.put<T>(url, data, config);
        return response.data;
    }

    async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.patch<T>(url, data, config);
        return response.data;
    }

    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.delete<T>(url, config);
        return response.data;
    }
}

// Service URLs from environment
export const API_URLS = {
    user: import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:3001',
    book: import.meta.env.VITE_BOOK_SERVICE_URL || 'http://localhost:3003',
    audio: import.meta.env.VITE_AUDIO_SERVICE_URL || 'http://localhost:3004',
    wallet: import.meta.env.VITE_WALLET_SERVICE_URL || 'http://localhost:3005',
    order: import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:3006',
    analytics: import.meta.env.VITE_ANALYTICS_SERVICE_URL || 'http://localhost:3008',
    payment: import.meta.env.VITE_PAYMENT_WEBHOOK_URL || 'http://localhost:3009',
    notification: import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:3010',
    seller: import.meta.env.VITE_SELLER_SERVICE_URL || 'http://localhost:3011',
    admin: import.meta.env.VITE_ADMIN_SERVICE_URL || 'http://localhost:3012',
    referral: import.meta.env.VITE_REFERRAL_SERVICE_URL || 'http://localhost:3013',
    gift: import.meta.env.VITE_GIFT_SERVICE_URL || 'http://localhost:3014',
    search: import.meta.env.VITE_SEARCH_SERVICE_URL || 'http://localhost:3015',
};

// Create client instances
export const userClient = new ApiClient(API_URLS.user);
export const bookClient = new ApiClient(API_URLS.book);
export const audioClient = new ApiClient(API_URLS.audio);
export const walletClient = new ApiClient(API_URLS.wallet);
export const orderClient = new ApiClient(API_URLS.order);
export const analyticsClient = new ApiClient(API_URLS.analytics);
export const paymentClient = new ApiClient(API_URLS.payment);
export const notificationClient = new ApiClient(API_URLS.notification);
export const sellerClient = new ApiClient(API_URLS.seller);
export const adminClient = new ApiClient(API_URLS.admin);
export const referralClient = new ApiClient(API_URLS.referral);
export const searchClient = new ApiClient(API_URLS.search);
