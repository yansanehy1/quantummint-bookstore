import { useCallback, useEffect, useRef, useState } from 'react';

export type SaveFn<T> = (data: T) => Promise<any>;

export interface UseAutoSaveFormOptions<T> {
  initialData: T;
  saveFn?: SaveFn<T>; // optional: if not provided the hook will simulate a save
  autoSaveDebounceMs?: number; // debounce delay after changes before auto-saving
  storageKey?: string; // optional localStorage key to persist/restore drafts
  autoLoadFromStorage?: boolean; // whether to load an existing draft from storage on mount
}

export function useAutoSaveForm<T extends Record<string, any>>(options: UseAutoSaveFormOptions<T>) {
  const { initialData, saveFn, autoSaveDebounceMs = 1000, storageKey, autoLoadFromStorage = false } = options;

  const [formData, setFormData] = useState<T>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [restoredFromStorage, setRestoredFromStorage] = useState(false);
  const [restoredAt, setRestoredAt] = useState<string | null>(null);

  const debounceRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    // attempt to restore draft from storage if requested
    if (autoLoadFromStorage && storageKey) {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          // support both { data, savedAt } and legacy plain data
          const maybeData = parsed && parsed.data ? parsed.data : parsed;
          if (maybeData) {
            setFormData((prev) => ({ ...prev, ...maybeData } as T));
            setRestoredFromStorage(true);
            setRestoredAt(parsed.savedAt || new Date().toISOString());
          }
        }
      } catch (err) {
        // ignore parse errors
        console.warn('Failed to restore draft from storage', err);
      }
    }

    return () => { mountedRef.current = false; };
  }, []);

  const performSave = useCallback(async (data: T) => {
    setIsSaving(true);
    try {
      if (saveFn) {
        await saveFn(data);
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // persist to localStorage as backup if storageKey is provided
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify({ data, savedAt: new Date().toISOString() }));
        } catch (err) {
          console.warn('Failed to persist draft to localStorage', err);
        }
      }

      if (!mountedRef.current) return;

      setSaveSuccess(true);
      // auto-clear success after 3s
      window.setTimeout(() => {
        if (mountedRef.current) setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      // we keep isSaving false in finally
    } finally {
      if (mountedRef.current) setIsSaving(false);
    }
  }, [saveFn]);

  const handleAutoSave = useCallback(async () => {
    // Exposed manual trigger that also uses the same save implementation
    await performSave(formData);
  }, [formData, performSave]);

  const handleManualSave = useCallback(async () => {
    await handleAutoSave();
    // small UX fallback; consumer can override
    try {
      // run in next microtask so the UI updates first
      window.setTimeout(() => {
        // eslint-disable-next-line no-alert
        alert('Your progress has been saved. You can continue later!');
      }, 0);
    } catch (err) {
      /* ignore */
    }
  }, [handleAutoSave]);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSectionChange = useCallback((section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
  }, []);

  // Shortcut wrappers matching your example names
  const handlePersonalInfoChange = useCallback((field: string, value: any) => {
    handleSectionChange('personalInfo', field, value);
  }, [handleSectionChange]);

  const handleBusinessInfoChange = useCallback((field: string, value: any) => {
    handleSectionChange('businessInfo', field, value);
  }, [handleSectionChange]);

  // Auto-save on changes with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      // fire-and-forget autosave (no blocking)
      performSave(formData).catch((err) => console.error('Auto-save error:', err));
      debounceRef.current = null;
    }, autoSaveDebounceMs) as unknown as number;

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  return {
    formData,
    setFormData,
    isSaving,
    saveSuccess,
    restoredFromStorage,
    restoredAt,
    handleAutoSave,
    handleManualSave,
    handleInputChange,
    handlePersonalInfoChange,
    handleBusinessInfoChange,
  } as const;
}
