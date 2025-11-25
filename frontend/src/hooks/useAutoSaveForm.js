"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAutoSaveForm = useAutoSaveForm;
const react_1 = require("react");
function useAutoSaveForm(options) {
    const { initialData, saveFn, autoSaveDebounceMs = 1000, storageKey, autoLoadFromStorage = false } = options;
    const [formData, setFormData] = (0, react_1.useState)(initialData);
    const [isSaving, setIsSaving] = (0, react_1.useState)(false);
    const [saveSuccess, setSaveSuccess] = (0, react_1.useState)(false);
    const [restoredFromStorage, setRestoredFromStorage] = (0, react_1.useState)(false);
    const [restoredAt, setRestoredAt] = (0, react_1.useState)(null);
    const debounceRef = (0, react_1.useRef)(null);
    const mountedRef = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(() => {
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
                        setFormData((prev) => ({ ...prev, ...maybeData }));
                        setRestoredFromStorage(true);
                        setRestoredAt(parsed.savedAt || new Date().toISOString());
                    }
                }
            }
            catch (err) {
                // ignore parse errors
                console.warn('Failed to restore draft from storage', err);
            }
        }
        return () => { mountedRef.current = false; };
    }, []);
    const performSave = (0, react_1.useCallback)(async (data) => {
        setIsSaving(true);
        try {
            if (saveFn) {
                await saveFn(data);
            }
            else {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 500));
            }
            // persist to localStorage as backup if storageKey is provided
            if (storageKey) {
                try {
                    localStorage.setItem(storageKey, JSON.stringify({ data, savedAt: new Date().toISOString() }));
                }
                catch (err) {
                    console.warn('Failed to persist draft to localStorage', err);
                }
            }
            if (!mountedRef.current)
                return;
            setSaveSuccess(true);
            // auto-clear success after 3s
            window.setTimeout(() => {
                if (mountedRef.current)
                    setSaveSuccess(false);
            }, 3000);
        }
        catch (error) {
            console.error('Auto-save failed:', error);
            // we keep isSaving false in finally
        }
        finally {
            if (mountedRef.current)
                setIsSaving(false);
        }
    }, [saveFn]);
    const handleAutoSave = (0, react_1.useCallback)(async () => {
        // Exposed manual trigger that also uses the same save implementation
        await performSave(formData);
    }, [formData, performSave]);
    const handleManualSave = (0, react_1.useCallback)(async () => {
        await handleAutoSave();
        // small UX fallback; consumer can override
        try {
            // run in next microtask so the UI updates first
            window.setTimeout(() => {
                // eslint-disable-next-line no-alert
                alert('Your progress has been saved. You can continue later!');
            }, 0);
        }
        catch (err) {
            /* ignore */
        }
    }, [handleAutoSave]);
    const handleInputChange = (0, react_1.useCallback)((field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);
    const handleSectionChange = (0, react_1.useCallback)((section, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...(prev[section] || {}),
                [field]: value,
            },
        }));
    }, []);
    // Shortcut wrappers matching your example names
    const handlePersonalInfoChange = (0, react_1.useCallback)((field, value) => {
        handleSectionChange('personalInfo', field, value);
    }, [handleSectionChange]);
    const handleBusinessInfoChange = (0, react_1.useCallback)((field, value) => {
        handleSectionChange('businessInfo', field, value);
    }, [handleSectionChange]);
    // Auto-save on changes with debounce
    (0, react_1.useEffect)(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = window.setTimeout(() => {
            // fire-and-forget autosave (no blocking)
            performSave(formData).catch((err) => console.error('Auto-save error:', err));
            debounceRef.current = null;
        }, autoSaveDebounceMs);
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
    };
}
