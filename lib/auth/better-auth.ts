import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

// Preview sign-in fix (portfolio-library sign-in block, 2026-10-30):
// BETTER_AUTH_URL is documented in README.md as the production URL
// (https://centher-app.vercel.app). When that variable is set on Vercel,
// appUrl above is production, so the old trustedOrigins list contained
// only production + localhost — a sign-in POST from any Vercel preview
// deployment carried a preview origin Better Auth does not trust, and
// Better Auth rejects it before credentials are even checked. The fix
// adds exactly this deployment's own host (VERCEL_URL, set by Vercel per
// deployment) — never a wildcard, never a user-supplied origin — so
// preview sign-in works while production behaviour is unchanged. When
// BETTER_AUTH_URL is unset, the deployment host already equals appUrl,
// so the extra entry is a harmless duplicate.
const deploymentOrigin = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : null;

const appUrl =
  process.env.BETTER_AUTH_URL || deploymentOrigin || "http://localhost:3002";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: appUrl,
  trustedOrigins: [
    appUrl,
    "https://centher-app.vercel.app",
    "https://app.sociaket.com",
    ...(deploymentOrigin ? [deploymentOrigin] : []),
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ],
});

export type Session = typeof auth.$Infer.Session;
