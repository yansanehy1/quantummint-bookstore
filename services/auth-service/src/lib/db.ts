export type User = {
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  lastSignedIn?: Date | null;
};

const byOpenId = new Map<string, User>();

export async function getUserByOpenId(openId: string): Promise<User | null> {
  return byOpenId.get(openId) ?? null;
}

export async function upsertUser(partial: Partial<User> & { openId: string }): Promise<User> {
  const existing = byOpenId.get(partial.openId) ?? {
    openId: partial.openId,
    name: null,
    email: null,
    loginMethod: null,
    lastSignedIn: null,
  } as User;
  const updated: User = {
    ...existing,
    ...partial,
  };
  byOpenId.set(updated.openId, updated);
  return updated;
}
