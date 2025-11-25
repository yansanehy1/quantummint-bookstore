export type SaveFn<T> = (data: T) => Promise<any>;
export interface UseAutoSaveFormOptions<T> {
    initialData: T;
    saveFn?: SaveFn<T>;
    autoSaveDebounceMs?: number;
    storageKey?: string;
    autoLoadFromStorage?: boolean;
}
export declare function useAutoSaveForm<T extends Record<string, any>>(options: UseAutoSaveFormOptions<T>): {
    readonly formData: T;
    readonly setFormData: import("react").Dispatch<import("react").SetStateAction<T>>;
    readonly isSaving: boolean;
    readonly saveSuccess: boolean;
    readonly restoredFromStorage: boolean;
    readonly restoredAt: string;
    readonly handleAutoSave: () => Promise<void>;
    readonly handleManualSave: () => Promise<void>;
    readonly handleInputChange: (field: string, value: any) => void;
    readonly handlePersonalInfoChange: (field: string, value: any) => void;
    readonly handleBusinessInfoChange: (field: string, value: any) => void;
};
