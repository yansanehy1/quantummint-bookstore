"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoginUrl = exports.APP_LOGO = exports.APP_TITLE = exports.ONE_YEAR_MS = exports.COOKIE_NAME = void 0;
// Local re-exported constants (also defined in shared for services).
exports.COOKIE_NAME = 'qm_session';
exports.ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
exports.APP_TITLE = import.meta.env.VITE_APP_TITLE || 'App';
exports.APP_LOGO = import.meta.env.VITE_APP_LOGO ||
    'https://placehold.co/128x128/E1E7EF/1F2937?text=App';
// Generate login URL at runtime so redirect URI reflects the current origin.
const getLoginUrl = () => {
    const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
    const appId = import.meta.env.VITE_APP_ID;
    const redirectUri = `${window.location.origin}/api/oauth/callback`;
    const state = btoa(redirectUri);
    const url = new URL(`${oauthPortalUrl}/app-auth`);
    url.searchParams.set('appId', appId);
    url.searchParams.set('redirectUri', redirectUri);
    url.searchParams.set('state', state);
    url.searchParams.set('type', 'signIn');
    return url.toString();
};
exports.getLoginUrl = getLoginUrl;
