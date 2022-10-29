import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  changePaths,
  checkMatch,
  getSessionUser,
} from "@/utils/middleware.helpers";
import { AppRoutes } from "@/constants/app.routes";

export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("sid");

  if (checkMatch(request.nextUrl, onlyPublicPages)) {
    const user = await getSessionUser(sessionId);
    if (user) {
      return NextResponse.redirect(
        `${request.nextUrl.origin}${AppRoutes.feed.index}`
      );
    }
  }

  if (checkMatch(request.nextUrl, comingSoonPages)) {
    if (
      process.env.NEXT_PUBLIC_APP_ENV === "production" ||
      process.env.NEXT_PUBLIC_APP_ENV === "staging"
    ) {
      return NextResponse.redirect(
        `${request.nextUrl.origin}${AppRoutes.coming_soon}`
      );
    }
  }

  if (checkMatch(request.nextUrl, authenticatedUserPages)) {
    const user = await getSessionUser(sessionId);
    if (!user) {
      return NextResponse.redirect(
        `${request.nextUrl.origin}${AppRoutes.auth.login}`
      );
    }
  }

  // Last step: return the request to Next.js
  return NextResponse.next();
}

// only public pages - logged in user can not access these pages
const _onlyPublicPages: string[] = [
  AppRoutes.auth.login,
  AppRoutes.auth.register,
];
const onlyPublicPages = changePaths(_onlyPublicPages);

// Authenticated Pages
const _authenticatedUserPages: string[] = [
  AppRoutes.profile.account_address,
  AppRoutes.profile.replies,
  AppRoutes.profile.followers,
  AppRoutes.profile.following,
  AppRoutes.profile.settings,
  AppRoutes.feed.index,
  AppRoutes.feed.single_post,
  AppRoutes.notifications,
];
const authenticatedUserPages = changePaths(_authenticatedUserPages);

// Coming soon pages - redirect to feed page
const _comingSoonPages: string[] = [
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
const comingSoonPages = changePaths(_comingSoonPages);
