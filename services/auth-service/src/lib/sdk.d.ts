import { type AxiosInstance } from "axios";
import type { Request } from "express";
import * as db from "./db";
import type { ExchangeTokenResponse, GetUserInfoResponse, GetUserInfoWithJwtResponse } from "./types/manusTypes";
export type SessionPayload = {
    openId: string;
    appId: string;
    name: string;
};
export declare class SDKServer {
    private readonly client;
    private readonly oauthService;
    constructor(client?: AxiosInstance);
    private deriveLoginMethod;
    exchangeCodeForToken(code: string, state: string): Promise<ExchangeTokenResponse>;
    getUserInfo(accessToken: string): Promise<GetUserInfoResponse>;
    private parseCookies;
    private getSessionSecret;
    createSessionToken(openId: string, options?: {
        expiresInMs?: number;
        name?: string;
    }): Promise<string>;
    signSession(payload: SessionPayload, options?: {
        expiresInMs?: number;
    }): Promise<string>;
    verifySession(cookieValue: string | undefined | null): Promise<{
        openId: string;
        appId: string;
        name: string;
    } | null>;
    getUserInfoWithJwt(jwtToken: string): Promise<GetUserInfoWithJwtResponse>;
    authenticateRequest(req: Request): Promise<db.User>;
}
export declare const sdk: SDKServer;
