"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = useAuth;
const AuthContext_1 = require("../contexts/AuthContext");
function useAuth() {
    return (0, AuthContext_1.useAuthContext)();
}
