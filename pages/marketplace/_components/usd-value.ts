import { formatBNB2USD, formatEther2Number } from "@/utils/format.address";

/**
 * Portfolio-library fix (Sociaket item 1): the BNB price hook returns 0 both
 * while the Moralis feed is loading AND when it has failed (it has no error
 * state), so a bare `formatBNB2USD(...)` renders a fake "$0" next to real
 * BNB prices. Never render $0 from an unknown feed:
 *
 * - BNB amount is zero (or missing) -> "$0" is genuine, render it.
 * - BNB amount is non-zero and the feed price is known -> "$<converted>".
 * - BNB amount is non-zero and the feed price is unknown (0) -> the USD
 *   value is unknown, so render "USD unavailable" and keep the BNB value
 *   the caller already shows next to it.
 */

export const formatUsdFromWei = (
  bnb: number | string | undefined,
  bnbPrice: number
): string => {
  const usd = formatBNB2USD(bnb, bnbPrice);
  if (usd > 0) return `$${usd}`;
  if (bnbPrice > 0) return "$0";
  const isZeroAmount = !bnb || formatEther2Number(bnb) === 0;
  return isZeroAmount ? "$0" : "USD unavailable";
};

/** Same rule for amounts already in plain BNB units (not wei). */
export const formatUsdFromBnb = (
  bnb: number | undefined,
  bnbPrice: number
): string => {
  if (!bnb) return "$0";
  if (bnbPrice > 0) return `$${Number((bnb * bnbPrice).toFixed(5))}`;
  return "USD unavailable";
};
