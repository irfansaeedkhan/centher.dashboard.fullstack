/**
 * Short-lived JWTs for the Centher voice server (VoiSpace rooms).
 *
 * Contract (locked — the voice server verifies exactly this):
 * - alg: HS256, secret = BETTER_AUTH_SECRET
 * - payload: { sub: <better-auth userId>, aud: "centher-voice",
 *              iat: <now>, exp: <now + 15min> }
 *
 * Minted server-side only, via GET /api/voice/token (session required).
 * Fail-closed: throws when BETTER_AUTH_SECRET is missing so we never mint
 * an unverifiable token.
 */
import { createHmac } from "crypto";

export const VOICE_TOKEN_AUDIENCE = "centher-voice";
/** 15 minutes, in seconds. */
export const VOICE_TOKEN_TTL_SECONDS = 15 * 60;

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function mintVoiceToken(
  userId: string,
  secret: string = process.env.BETTER_AUTH_SECRET || ""
): string {
  if (!userId) throw new Error("mintVoiceToken: userId is required");
  if (!secret)
    throw new Error(
      "mintVoiceToken: BETTER_AUTH_SECRET is not set — refusing to mint"
    );
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      sub: userId,
      aud: VOICE_TOKEN_AUDIENCE,
      iat: now,
      exp: now + VOICE_TOKEN_TTL_SECONDS,
    })
  );
  const signature = base64url(
    createHmac("sha256", secret).update(`${header}.${payload}`).digest()
  );
  return `${header}.${payload}.${signature}`;
}
