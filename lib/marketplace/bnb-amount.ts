/**
 * Marketplace-grill Q7/Q3: exact BNB decimal handling.
 *
 * Bid amounts used to flow through `Number(...)` + `toFixed(4)` into a
 * numeric(18,4) column: a 0.00001 BNB bid rounded to "0.0000" in storage
 * yet still wiped the real top bid, and huge amounts overflowed the
 * column into a raw 500.
 *
 * This helper parses amounts as decimal strings into a wei-scale BigInt
 * (1 BNB = 1e18). Validation, floor comparisons, and the stored string
 * all derive from that exact value — floats never touch the money path,
 * nothing is ever rounded, and unrepresentable input is rejected with a
 * readable reason instead of being silently mangled.
 */

/** Fractional digits the money columns carry: numeric(38,18). */
export const BNB_DECIMALS = 18;
/** Integer digits the money columns carry: numeric(38,18). */
export const BNB_MAX_INTEGER_DIGITS = 20;

const SCALE = 10n ** BigInt(BNB_DECIMALS);

export interface ParsedBnbAmount {
  /** Canonical decimal string (trailing zeros trimmed) — safe to store. */
  canonical: string;
  /** Exact value scaled by 1e18 (wei). Compare these, never floats. */
  scaled: bigint;
}

export type BnbParseResult =
  | { ok: true; value: ParsedBnbAmount }
  | { ok: false; error: string };

const fail = (error: string): BnbParseResult => ({ ok: false, error });

export function parseBnbAmount(input: string | number): BnbParseResult {
  let raw: string;
  if (typeof input === "number") {
    if (!Number.isFinite(input))
      return fail("Bid amount must be a valid number");
    raw = String(input);
  } else if (typeof input === "string") {
    raw = input.trim();
  } else {
    return fail("Bid amount must be a number");
  }

  if (raw === "") return fail("Bid amount is required");
  // Exponent notation (1e21, 1e-7) can't be represented exactly by the
  // string parser — reject with a readable reason instead of guessing.
  if (/^[+-]?[\d.]+[eE][+-]?\d+$/.test(raw))
    return fail("Bid amount is out of range — enter a plain BNB amount");
  const m = /^(\d+)(?:\.(\d+))?$/.exec(raw);
  if (!m)
    return fail("Bid amount must be a positive number in BNB (e.g. 0.25)");

  const intPart = m[1].replace(/^0+(?=\d)/, "");
  const fracPart = m[2] ?? "";
  if (intPart.length > BNB_MAX_INTEGER_DIGITS)
    return fail("Bid amount is too large");
  if (fracPart.length > BNB_DECIMALS)
    return fail(
      "Bid amount is too precise — the smallest unit is 0.000000000000000001 BNB"
    );

  const scaled =
    BigInt(intPart) * SCALE + BigInt(fracPart.padEnd(BNB_DECIMALS, "0"));
  const intStr = (scaled / SCALE).toString();
  const fracStr = (scaled % SCALE)
    .toString()
    .padStart(BNB_DECIMALS, "0")
    .replace(/0+$/, "");
  return {
    ok: true,
    value: {
      canonical: fracStr ? `${intStr}.${fracStr}` : intStr,
      scaled,
    },
  };
}

/**
 * Parse a value already stored in a money column (always a plain decimal
 * string, possibly zero-padded to the column scale) into its wei-scale
 * BigInt for exact comparisons. Throws on a malformed stored value —
 * stored data is written only through `parseBnbAmount`, so a throw here
 * means data corruption and should surface, not silently compare wrong.
 */
export function storedBnbToScaled(value: string): bigint {
  const parsed = parseBnbAmount(value);
  if (!parsed.ok) throw new Error(`Stored BNB amount is malformed: ${value}`);
  return parsed.value.scaled;
}
