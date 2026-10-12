/**
 * QA-fix regression tests (Pilot sweep 2026-10-12).
 *
 * 1. Post detail crash: reply `parent_post.user` must always carry
 *    `membership` — its absence crashed PostHeader's verification tick
 *    ("Cannot read properties of undefined (reading 'status')") for any
 *    post with replies.
 * 2. `useVerificationTick` must never throw on a user without membership.
 */
import { renderHook } from "@testing-library/react";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";

describe("QA-fix regressions", () => {
  it("useVerificationTick does not throw when membership is missing", () => {
    const { result } = renderHook(() =>
      useVerificationTick({
        user: { membership: undefined } as unknown as {
          membership: { status: string };
        },
      })
    );
    expect(result.current).toBeNull();
  });

  it("useVerificationTick does not throw when user is null", () => {
    const { result } = renderHook(() =>
      useVerificationTick({ user: null })
    );
    expect(result.current).toBeNull();
  });

  it("useVerificationTick still resolves citizen/verified ticks", () => {
    const { result: citizen } = renderHook(() =>
      useVerificationTick({
        user: { membership: { status: "citizen" } } as never,
      })
    );
    expect(citizen.current).toBe("/images/citizen-icon.svg");

    const { result: verified } = renderHook(() =>
      useVerificationTick({
        user: { membership: { status: "verified" } } as never,
      })
    );
    expect(verified.current).toBe("/images/verified-icon.png");
  });
});
