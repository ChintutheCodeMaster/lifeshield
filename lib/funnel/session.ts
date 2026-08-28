import "server-only";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const COOKIE = "mintlife_lead";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function getOrCreateSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE)?.value;
  if (existing) return existing;
  const id = randomUUID();
  store.set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    path: "/",
  });
  return id;
}

export async function getSessionId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE)?.value ?? null;
}

export async function clearSessionId() {
  const store = await cookies();
  store.delete(COOKIE);
}
