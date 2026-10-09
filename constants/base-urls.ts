/**
 * Phase 1 API identity (Captain decision 2026-10-10): the solo fullstack stack
 * serves ALL APIs from this Next app under same-origin `/api/*`. The legacy
 * external CAPI/CIS/CFS hosts are decommissioned as a client path — every
 * client call site uses a `/api/*` path (see `__tests__/api-identity.test.ts`).
 *
 * NOTE: `NEXT_PUBLIC_USE_SAME_ORIGIN_API` is still read directly by
 * `hooks/stream/use.core.tsx` and `lib/get-user-genealogy/index.ts` as a
 * solo-demo feature flag. It no longer controls these base URLs.
 */
export const CAPIBaseURL = "";
export const CISBaseURL = "";
export const CFSBaseURL = "";
export const WalletServiceBaseURL =
  process.env.NEXT_PUBLIC_WALLET_SERVICE_URL || "";
