export type User = {
    openId: string;
    name: string | null;
    email: string | null;
    loginMethod: string | null;
    lastSignedIn?: Date | null;
};
export declare function getUserByOpenId(openId: string): Promise<User | null>;
export declare function upsertUser(partial: Partial<User> & {
    openId: string;
}): Promise<User>;
