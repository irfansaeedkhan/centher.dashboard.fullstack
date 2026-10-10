/**
 * @jest-environment node
 *
 * Auth-trap hardening: the axios response interceptor must not mask 401s.
 *
 * Bug: on a 401 with legacy access/refresh cookies present, the interceptor
 * tried refreshTokens() -> POST /api/wallet/refresh-tokens, which does not
 * exist (honest 501). The catch rejected with the REFRESH error, so
 * useUser's isUnauthorized() saw a 501 instead of the 401 ->
 * handleStaleSession() never fired -> the dead-cookie trap persisted.
 *
 * Fix: on refresh failure, reject with the ORIGINAL 401 error.
 */
import axios, { AxiosInstance } from "axios";

const LEGACY_TOKENS = { access_token: "legacy-access", refresh_token: "legacy-refresh" };

const mockGetAuthTokens = jest.fn();
const mockRefreshTokens = jest.fn();

jest.mock("@/lib/auth", () => ({
  getAuthTokens: (...args: unknown[]) => mockGetAuthTokens(...args),
  refreshTokens: (...args: unknown[]) => mockRefreshTokens(...args),
}));

// require (not import): ES imports hoist above the jest.mock call.
const {
  registerAuthTokenResponseInterceptor,
} = require("@/utils/axios/auth-tokens-interceptors");

const errWithStatus = (status: number, url: string, code: string) => {
  const err: any = new Error(`request failed with status ${status}`);
  err.config = { url };
  err.response = { status, data: { code } };
  return err;
};

/** Adapter that fails every request with the given status. */
const failingAdapter = (status: number, code: string) => async (config: any) => {
  throw errWithStatus(status, config.url, code);
};

const makeInstance = (): AxiosInstance => {
  const instance = axios.create();
  registerAuthTokenResponseInterceptor(instance);
  return instance;
};

beforeEach(() => {
  mockGetAuthTokens.mockReset();
  mockRefreshTokens.mockReset();
});

describe("auth token response interceptor (401 masking)", () => {
  test("refresh failure rejects with the ORIGINAL 401, not the refresh error", async () => {
    mockGetAuthTokens.mockReturnValue(LEGACY_TOKENS);
    // /api/wallet/refresh-tokens does not exist -> honest 501.
    mockRefreshTokens.mockRejectedValue(errWithStatus(501, "/api/wallet/refresh-tokens", "NOT_IMPLEMENTED"));

    const instance = makeInstance();
    instance.defaults.adapter = failingAdapter(401, "UNAUTHORIZED");

    const rejection = await instance.get("/api/users/me").catch((e) => e);
    expect(rejection?.response?.status).toBe(401);
    expect(rejection?.response?.data?.code).toBe("UNAUTHORIZED");
  });

  test("no legacy tokens -> 401 propagates unchanged (no refresh attempted)", async () => {
    mockGetAuthTokens.mockReturnValue(null);

    const instance = makeInstance();
    instance.defaults.adapter = failingAdapter(401, "UNAUTHORIZED");

    const rejection = await instance.get("/api/users/me").catch((e) => e);
    expect(rejection?.response?.status).toBe(401);
    expect(mockRefreshTokens).not.toHaveBeenCalled();
  });

  test("refresh success -> original request is retried once", async () => {
    mockGetAuthTokens.mockReturnValue(LEGACY_TOKENS);
    mockRefreshTokens.mockResolvedValue({
      access_token: "new-access",
      refresh_token: "new-refresh",
    });

    const instance = makeInstance();
    let calls = 0;
    instance.defaults.adapter = async (config: any) => {
      calls += 1;
      if (calls === 1) throw errWithStatus(401, config.url, "UNAUTHORIZED");
      return {
        data: { ok: true },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    const res = await instance.get("/api/users/me");
    expect(res.status).toBe(200);
    expect(calls).toBe(2);
  });
});
