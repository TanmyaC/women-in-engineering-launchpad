export const INVITE_STORAGE_KEY = "mwie-invite-code";

/** Invite codes are short URL-safe tokens; anything else is ignored. */
export function normalizeInviteCode(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const code = raw.trim();
  return /^[A-Za-z0-9_-]{6,64}$/.test(code) ? code : null;
}
