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
    const user = await getSessionUser(sessionId?.value);
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
    const user = await getSessionUser(sessionId?.value);
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
  AppRoutes.profile.collections,
  AppRoutes.profile.purchased,
  AppRoutes.profile.nfts,
  AppRoutes.profile.settings,
  AppRoutes.feed.index,
  AppRoutes.feed.single_post,
  AppRoutes.notifications,
  AppRoutes.marketplace.nft,
  AppRoutes.marketplace.create_nft,
  AppRoutes.marketplace.create_collection,
  AppRoutes.marketplace.explore,
  AppRoutes.marketplace.all_nfts,
  AppRoutes.marketplace.all_collections,
  AppRoutes.marketplace.collection,
  AppRoutes.referral.network_genealogy,
  AppRoutes.referral.overview,
  AppRoutes.referral.network_rewards,
];
const authenticatedUserPages = changePaths(_authenticatedUserPages);

// Coming soon pages - redirect to feed page
const _comingSoonPages: string[] = [
  AppRoutes.home,
  AppRoutes.chat,
  AppRoutes.staking_packs,
  AppRoutes.buy_centher,
  AppRoutes.profits_dashboard,
  AppRoutes.voting_chain,

  AppRoutes.admin.index,
  AppRoutes.admin.staking_packs,
  AppRoutes.admin.create_staking_pack,
  AppRoutes.admin.update_staking_pack,
];
const comingSoonPages = changePaths(_comingSoonPages);
