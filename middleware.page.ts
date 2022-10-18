import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AppRoutes } from "@/constants/app.routes";
import { NODE_API_URL } from "@/constants/common";

export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("sid");

  if (onlyPublicPages.includes(request.nextUrl.pathname)) {
    const user = await getUser(sessionId);
    if (user) {
      return NextResponse.redirect(
        `${request.nextUrl.origin}${AppRoutes.feed.index}`
      );
    }
  }

  if (comingSoonPages.includes(request.nextUrl.pathname)) {
    if (
      process.env.NEXT_PUBLIC_APP_ENV === "production" ||
      process.env.NEXT_PUBLIC_APP_ENV === "staging"
    ) {
      return NextResponse.redirect(
        `${request.nextUrl.origin}${AppRoutes.coming_soon}`
      );
    }
  }

  if (authenticatedUserPages.includes(request.nextUrl.pathname)) {
    const user = await getUser(sessionId);
    if (!user) {
      return NextResponse.redirect(
        `${request.nextUrl.origin}${AppRoutes.auth.login}`
      );
    }
  }

  // Last step: return the request to Next.js
  return NextResponse.next();
}

// Get logged in user from Node JS API using session id
async function getUser(sessionId: string | undefined) {
  if (!sessionId) return null;

  try {
    const res = await fetch(`${NODE_API_URL}/api/auth/session`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: `sid=${sessionId}`,
      },
    });
    const data = await res.json();
    return data.user;
  } catch (err) {
    console.log(err);
    return null;
  }
}

// only public pages - logged in user can not access these pages
const onlyPublicPages: string[] = [
  AppRoutes.auth.login,
  AppRoutes.auth.register,
];

// Authenticated Pages
const authenticatedUserPages: string[] = [
  AppRoutes.profile.settings,
  AppRoutes.feed.index,
  AppRoutes.notifications,
];

// Coming soon pages - redirect to feed page
const comingSoonPages: string[] = [
  AppRoutes.home,
  AppRoutes.explore,
  AppRoutes.top_influencers,
  AppRoutes.chat,
  AppRoutes.staking_packs,
  AppRoutes.network_rewards,
  AppRoutes.buy_ntr_dao,
  AppRoutes.profits_dashboard,
  AppRoutes.voting_chain,
  AppRoutes.referral_program,

  AppRoutes.profile.nfts,

  AppRoutes.admin.index,
  AppRoutes.admin.staking_packs,
  AppRoutes.admin.create_staking_pack,
  AppRoutes.admin.update_staking_pack,

  AppRoutes.nfts.create_nft,
  AppRoutes.nfts.create_collection,
];
