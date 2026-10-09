/**
 * Solo fullstack stack serves APIs from this Next app under `/api/*`.
 * Same-origin (empty base) avoids stale staging hosts baked into Vercel env.
 * Set NEXT_PUBLIC_USE_SAME_ORIGIN_API=false to use external CAPI/CIS hosts.
 */
const useSameOriginApi =
  process.env.NEXT_PUBLIC_USE_SAME_ORIGIN_API !== "false";

export const CAPIBaseURL = useSameOriginApi
  ? ""
  : process.env.NEXT_PUBLIC_CAPI_HOST || "";
export const CISBaseURL = useSameOriginApi
  ? ""
  : process.env.NEXT_PUBLIC_CIS_HOST || "";
export const CFSBaseURL = useSameOriginApi
  ? ""
  : process.env.NEXT_PUBLIC_CFS_HOST || "";
export const WalletServiceBaseURL =
  process.env.NEXT_PUBLIC_WALLET_SERVICE_URL || "";
