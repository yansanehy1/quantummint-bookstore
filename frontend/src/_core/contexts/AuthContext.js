"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProvider = AuthProvider;
exports.useAuthContext = useAuthContext;
const react_1 = require("react");
const trpcClient_1 = require("../trpcClient");
const AuthContext = (0, react_1.createContext)(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const refresh = async () => {
        try {
            const me = await trpcClient_1.trpc.auth.me.query();
            setUser(me ?? null);
        }
        catch {
            setUser(null);
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const logout = async () => {
        try {
            await trpcClient_1.trpc.auth.logout.mutate();
        }
        finally {
            setUser(null);
        }
    };
    const value = (0, react_1.useMemo)(() => ({ user, loading, setUser, logout, refresh }), [user, loading]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
function useAuthContext() {
    const ctx = (0, react_1.useContext)(AuthContext);
    if (!ctx)
        throw new Error('useAuthContext must be used within AuthProvider');
    return ctx;
}
