/**
 * Phase 1 API-identity regression test.
 *
 * Captain decision 2026-10-10: the solo fullstack stack serves ALL APIs from
 * this Next app under same-origin `/api/*`. Legacy external CIS/CFS paths and
 * bare relative URLs (e.g. `"api/socials/..."`) must never come back.
 *
 * This test scans every client source file for axios/fetch call literals and
 * fails if any URL does not start with `/api/` (absolute http(s) URLs for
 * third-party services are allowed; they are not our API).
 */
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "coverage",
  "dist",
  "build",
  "out",
]);

function* walk(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walk(full);
    } else if (
      /\.(ts|tsx)$/.test(entry.name) &&
      !/\.test\.(ts|tsx)$/.test(entry.name)
    ) {
      yield full;
    }
  }
}

const AXIOS_CALL =
  /axios[A-Za-z]*\.(get|post|patch|put|delete)(<[^>]*>)?\(\s*(`[^`]*`|"[^"]*"|'[^']*')/g;
const FETCH_CALL = /fetch\(\s*(`[^`]*`|"[^"]*"|'[^']*')/g;

function isAllowed(url: string): boolean {
  return (
    url.startsWith("/api/") ||
    url.startsWith("http://") ||
    url.startsWith("https://")
  );
}

describe("API identity: client calls use same-origin /api/*", () => {
  test("no axios/fetch literal uses a legacy or relative path", () => {
    const violations: string[] = [];

    for (const file of walk(ROOT)) {
      const src = fs.readFileSync(file, "utf8");
      const rel = path.relative(ROOT, file);

      for (const re of [AXIOS_CALL, FETCH_CALL]) {
        re.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = re.exec(src)) !== null) {
          const raw = m[m.length - 1] as string;
          const url = raw.slice(1, -1); // strip surrounding quotes/backticks
          if (!isAllowed(url)) {
            violations.push(`${rel}: ${url}`);
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });

  test("no bare relative api path (missing leading slash)", () => {
    const violations: string[] = [];

    for (const file of walk(ROOT)) {
      const src = fs.readFileSync(file, "utf8");
      const rel = path.relative(ROOT, file);

      // `"api/..."` or `'api/...'` without a leading slash — resolves
      // against the current page path (e.g. `/feed/api/...`) and 404s.
      const re = /["'`]api\/[a-z0-9/_${}.-]+["'`]/gi;
      let m: RegExpExecArray | null;
      while ((m = re.exec(src)) !== null) {
        violations.push(`${rel}: ${m[0]}`);
      }
    }

    expect(violations).toEqual([]);
  });
});
