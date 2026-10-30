/**
 * Portfolio video library fix-all: Centher marketplace / launchpad /
 * staking fixes (2026-10-29). Behavioral tests for the USD helper plus
 * source-level guards for the render fixes that need a browser to prove
 * visually (live check still owed to the parent agent).
 */
import { readFileSync } from "fs";
import { join } from "path";
import {
  formatUsdFromBnb,
  formatUsdFromWei,
} from "@/pages/marketplace/_components/usd-value";

const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8");

describe("Centher item 1: USD values never render a fake $0", () => {
  test("wei amounts convert when the feed price is known", () => {
    // 1 BNB (wei) at $600.
    expect(formatUsdFromWei("1000000000000000000", 600)).toBe("$600");
    expect(formatUsdFromWei("500000000000000000", 600)).toBe("$300");
  });

  test("a non-zero amount with no feed price is unavailable, not $0", () => {
    expect(formatUsdFromWei("1000000000000000000", 0)).toBe("USD unavailable");
    expect(formatUsdFromBnb(2, 0)).toBe("USD unavailable");
  });

  test("a genuine zero amount is still $0 with no feed price", () => {
    expect(formatUsdFromWei("0", 0)).toBe("$0");
    expect(formatUsdFromWei(undefined, 0)).toBe("$0");
    expect(formatUsdFromBnb(0, 0)).toBe("$0");
    expect(formatUsdFromBnb(undefined, 0)).toBe("$0");
  });

  test("plain BNB amounts convert when the feed price is known", () => {
    expect(formatUsdFromBnb(2, 600)).toBe("$1200");
  });

  test("listed filter translates UI vocabulary to API vocabulary", () => {
    const lib = read("lib/get-nft-list-of-single-collection/index.ts");
    expect(lib).toMatch(/saleState === "List"/);
    expect(lib).toMatch(/"Sale"/);
    expect(lib).toMatch(/saleState === "NON"/);
    expect(lib).toMatch(/"NotForSale"/);
  });
});

describe("Centher items 2-3: launchpad list and detail honesty", () => {
  test("list dedupes by project id and renders plain-unit caps", () => {
    const list = read("pages/launchpad/launchpad-list/index.page.tsx");
    expect(list).toMatch(/seenProjects/);
    const card = read(
      "pages/launchpad/launchpad-list/_components/launchpad-card.tsx"
    );
    expect(card).not.toMatch(/minTokensToSell\.div/);
    expect(card).not.toMatch(/\/ 1e18/);
    expect(card).toMatch(/completed/);
  });

  test("detail marks missing supply/caps/vesting/buy limits unavailable", () => {
    const data = read(
      "pages/launchpad/launchpad-list/[id]/_components/launchpad-overview/presale-data.tsx"
    );
    expect(data).toMatch(/Not available/);
    expect(data).not.toMatch(/formatUnits\(maxTokensToSell/);
    const status = read(
      "pages/launchpad/launchpad-list/[id]/_components/launchpad-overview/presale-status.tsx"
    );
    expect(status).toMatch(/Not available/);
    expect(status).not.toMatch(/BigInt\(roundDetails\.minContribution\)/);
  });
});

describe("Centher items 4-5: staking gate and FAQ", () => {
  test("wallet modal is dismissible when the staking route opts in", () => {
    const modal = read("components/modal/connect-wallet-modal.tsx");
    expect(modal).toMatch(/allowDismiss/);
    expect(modal).toMatch(/shouldCloseOnOverlayClick=\{allowDismiss\}/);
    expect(modal).toMatch(/shouldCloseOnEsc=\{allowDismiss\}/);
    const details = read("pages/staking/staking-details/[id]/index.page.tsx");
    expect(details).toMatch(/allowDismiss/);
    expect(details).toMatch(/walletGateDismissed/);
    expect(details).toMatch(/Back to staking/);
  });

  test("the whole FAQ row toggles, not just the icon", () => {
    const faq = read("pages/staking/_components/single-faq.tsx");
    expect(faq).toMatch(/aria-expanded/);
    expect(faq).toMatch(/onClick=\{toggle\}/);
    expect(faq).toMatch(/stopPropagation/);
  });
});

describe("Centher item 6: NFT detail controls", () => {
  test("details is a real toggle and empty mint hash is labelled", () => {
    const details = read("pages/marketplace/_components/nft.details.tsx");
    expect(details).toMatch(/aria-expanded/);
    expect(details).toMatch(/setIsOpen/);
    expect(details).toMatch(/Not available/);
  });

  test("share popup renders conditionally, not via hidden/!block", () => {
    const rightside = read("pages/marketplace/_components/nft.rightside.tsx");
    expect(rightside).toMatch(/togglePop && \(/);
    // The old show/hide class combination is gone (the string still
    // appears in the explanatory comment above the new code).
    expect(rightside).not.toMatch(/hidden w-\[240px\]/);
    expect(rightside).not.toMatch(/z-50 !block/);
  });
});
