/**
 * @jest-environment node
 *
 * Voice token contract tests (Judge F1 fix).
 *
 * The web app mints short-lived HS256 JWTs for the voice server:
 *   GET /api/voice/token  (Better Auth session required)
 *   -> { token }  with payload { sub: userId, aud: "centher-voice",
 *                                iat, exp: now+15min }, secret = BETTER_AUTH_SECRET
 *
 * The voice server verifies this exact contract with jose. These tests pin
 * the app side of it.
 *
 * DATABASE_URL / BETTER_AUTH_SECRET are stubbed; @/db and better-auth are
 * mocked (same pattern as phase2-social-routes.test.ts) — no DB, no network.
 */
import { createHmac } from "crypto";

process.env.DATABASE_URL =
  "postgresql://testuser:testpass@localhost:5432/testdb";
process.env.BETTER_AUTH_SECRET = "test-voice-secret-please-ignore";

jest.mock("@/db", () => ({ db: {} }));
jest.mock("@/lib/auth/better-auth", () => ({
  auth: { api: { getSession: jest.fn() }, handler: jest.fn() },
}));

// require (not import): ES imports hoist above the env assignment and mocks.
const { createHonoApp } = require("@/server/hono/app");
const {
  mintVoiceToken,
  VOICE_TOKEN_AUDIENCE,
  VOICE_TOKEN_TTL_SECONDS,
} = require("@/lib/voice/voice-token");

const { auth } = jest.requireMock("@/lib/auth/better-auth");
const getSession = auth.api.getSession as jest.Mock;

function decodePart(token: string, index: number): any {
  const part = token.split(".")[index];
  return JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
}

describe("mintVoiceToken", () => {
  test("mints a 3-part HS256 JWT with the locked claims", () => {
    const before = Math.floor(Date.now() / 1000);
    const token = mintVoiceToken("user_abc123", "s3cr3t");
    const after = Math.floor(Date.now() / 1000);

    expect(token.split(".")).toHaveLength(3);
    expect(decodePart(token, 0)).toEqual({ alg: "HS256", typ: "JWT" });

    const payload = decodePart(token, 1);
    expect(payload.sub).toBe("user_abc123");
    expect(payload.aud).toBe(VOICE_TOKEN_AUDIENCE);
    expect(payload.aud).toBe("centher-voice");
    expect(payload.iat).toBeGreaterThanOrEqual(before);
    expect(payload.iat).toBeLessThanOrEqual(after);
    expect(payload.exp - payload.iat).toBe(VOICE_TOKEN_TTL_SECONDS);
    expect(VOICE_TOKEN_TTL_SECONDS).toBe(15 * 60);
  });

  test("signature is a real HMAC-SHA256 over header.payload", () => {
    const token = mintVoiceToken("user_x", "s3cr3t");
    const [header, payload, signature] = token.split(".");
    const expected = createHmac("sha256", "s3cr3t")
      .update(`${header}.${payload}`)
      .digest("base64url");
    expect(signature).toBe(expected);
  });

  test("fail-closed: throws without a secret", () => {
    expect(() => mintVoiceToken("user_x", "")).toThrow();
  });

  test("fail-closed: throws without a userId", () => {
    expect(() => mintVoiceToken("", "s3cr3t")).toThrow();
  });

  test("tokens differ across mints (iat changes)", async () => {
    const a = mintVoiceToken("user_x", "s3cr3t");
    await new Promise((r) => setTimeout(r, 1100));
    const b = mintVoiceToken("user_x", "s3cr3t");
    expect(a).not.toBe(b);
  });
});

describe("GET /api/voice/token", () => {
  const app = createHonoApp();

  beforeEach(() => {
    getSession.mockReset();
  });

  test("is registered", () => {
    const registered = new Set(
      app.routes.map(
        (r: { method: string; path: string }) => `${r.method} ${r.path}`
      )
    );
    expect(registered.has("GET /api/voice/token")).toBe(true);
  });

  test("401 when there is no session", async () => {
    getSession.mockResolvedValue(null);
    const res = await app.request("/api/voice/token");
    expect(res.status).toBe(401);
  });

  test("200 returns a JWT verifiable with BETTER_AUTH_SECRET", async () => {
    getSession.mockResolvedValue({ user: { id: "user_voice_1" } });
    const res = await app.request("/api/voice/token");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(typeof body.token).toBe("string");

    // Verify the signature independently (what the voice server does).
    const [header, payload, signature] = (body.token as string).split(".");
    const expected = createHmac("sha256", process.env.BETTER_AUTH_SECRET!)
      .update(`${header}.${payload}`)
      .digest("base64url");
    expect(signature).toBe(expected);

    const claims = decodePart(body.token, 1);
    expect(claims.sub).toBe("user_voice_1");
    expect(claims.aud).toBe("centher-voice");
    expect(claims.exp - claims.iat).toBe(15 * 60);
  });

  test("rate-limited after 30 mints in a minute", async () => {
    getSession.mockResolvedValue({ user: { id: "user_ratelimit" } });
    let lastStatus = 200;
    for (let i = 0; i < 35; i++) {
      const res = await app.request("/api/voice/token");
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });
});

describe("SocketClientService.getToken (voice)", () => {
  const FRIENDLY = "Could not connect to the voice server. Please try again.";

  // SocketClientService is a static class with a private getToken.
  const { SocketClientService } = require("@/stream/clients/socket-client");
  const getToken = (): Promise<string> =>
    (
      SocketClientService as unknown as { getToken(): Promise<string> }
    ).getToken();

  const realFetch = global.fetch;

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    (global as any).fetch = realFetch;
    (console.error as jest.Mock).mockRestore();
  });

  test("uses the /api/voice/token endpoint and returns its token", async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "header.payload.sig" }),
    });
    await expect(getToken()).resolves.toBe("header.payload.sig");
    expect(global.fetch).toHaveBeenCalledWith("/api/voice/token", {
      credentials: "include",
    });
  });

  test("non-OK response -> friendly error (never the raw reason)", async () => {
    (global as any).fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 401 });
    await expect(getToken()).rejects.toThrow(FRIENDLY);
    await expect(getToken()).rejects.not.toThrow("401");
  });

  test("missing token in body -> friendly error", async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    await expect(getToken()).rejects.toThrow(FRIENDLY);
  });

  test("network failure -> friendly error", async () => {
    (global as any).fetch = jest.fn().mockRejectedValue(new Error("boom"));
    await expect(getToken()).rejects.toThrow(FRIENDLY);
    await expect(getToken()).rejects.not.toThrow("boom");
  });
});
