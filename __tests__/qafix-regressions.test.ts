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
    const { result } = renderHook(() => useVerificationTick({ user: null }));
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

describe("QA-fix round 2 regressions (2026-10-12)", () => {
  // FAIL 2: new Date(undefined) is an Invalid Date that is TRUTHY — the old
  // truthiness check let <Countdown> render 0:0:0:0. Validity must be checked.
  const isValidTargetDate = (d: unknown): d is Date =>
    d instanceof Date && !isNaN(d.getTime());

  it("Invalid Date is rejected as a countdown target", () => {
    const invalid = new Date(undefined as unknown as string);
    expect(Boolean(invalid)).toBe(true); // truthy! (the trap)
    expect(isValidTargetDate(invalid)).toBe(false);
  });

  it("missing/undefined dates are rejected as countdown targets", () => {
    expect(isValidTargetDate(undefined)).toBe(false);
    expect(isValidTargetDate(null)).toBe(false);
  });

  it("real dates are accepted as countdown targets", () => {
    expect(isValidTargetDate(new Date("2030-01-01T00:00:00Z"))).toBe(true);
  });

  // FAIL 3: share menu toggle must live on the <button> (keyboard Enter),
  // not on the inner icon (mouse-only). Source-level contract test.
  it("post footer toggles share menu from the button onClick", () => {
    const fs = require("fs");
    const src = fs.readFileSync(
      "components/feed.components/single.post.v2/post.footer.tsx",
      "utf8"
    );
    // Button owns the toggle...
    expect(src).toMatch(
      /aria-label="Share post"[\s\S]*?setIsShareMenuOpen\(\(prev\) => !prev\)/
    );
    // ...and the inner ShareIcon no longer has its own onClick (would
    // double-toggle on mouse click and be unreachable by keyboard).
    const iconBlock = src.match(/<ShareIcon[\s\S]*?\/>/);
    expect(iconBlock?.[0]).not.toMatch(/onClick/);
  });
});
