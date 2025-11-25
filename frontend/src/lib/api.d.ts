export declare function apiRequest<T = any>(endpoint: string, options?: RequestInit): Promise<T>;
export declare function uploadFile(file: File, onProgress?: (progress: number) => void): Promise<{
    url: string;
}>;
