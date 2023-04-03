import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  changePaths,
  checkMatch,
  isAdmin,
  isAuthenticated,
} from "@/utils/middleware.helpers";
import { AppRoutes } from "@/constants/app.routes";

export async function middleware(request: NextRequest) {
  if (checkMatch(request.nextUrl, publicOrAuthenticatedPages)) {
    return NextResponse.next();
  }

  if (checkMatch(request.nextUrl, notReadyPages)) {
    if (
      process.env.NEXT_PUBLIC_APP_ENV === "production" ||
      process.env.NEXT_PUBLIC_APP_ENV === "staging"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = AppRoutes.coming_soon;
      return NextResponse.redirect(url);
    }
  }
  if (checkMatch(request.nextUrl, notReadyPagesv2)) {
    if (
      process.env.NEXT_PUBLIC_APP_ENV === "production" ||
      process.env.NEXT_PUBLIC_APP_ENV === "staging"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = AppRoutes.coming_soon_v2;
      return NextResponse.redirect(url);
    }
  }

  if (checkMatch(request.nextUrl, adminPages)) {
    if (!(await isAdmin(request))) {
      return NextResponse.redirect(
        `${request.nextUrl.origin}${AppRoutes.feed.index}`
      );
    } else {
      return NextResponse.next();
    }
  }

  if (checkMatch(request.nextUrl, onlyPublicPages)) {
    if (await isAuthenticated(request)) {
      return NextResponse.redirect(
        `${request.nextUrl.origin}${AppRoutes.feed.index}`
      );
    } else {
      return NextResponse.next();
    }
  }

  if (checkMatch(request.nextUrl, authenticatedUserPages)) {
    if (!(await isAuthenticated(request))) {
      return NextResponse.redirect(
        `${request.nextUrl.origin}${AppRoutes.auth.login}`
      );
    } else {
      return NextResponse.next();
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

// public or authenticated pages
const _publicOrAuthenticatedPages: string[] = [AppRoutes.terms];
const publicOrAuthenticatedPages = changePaths(_publicOrAuthenticatedPages);

// admin specific pages
const _adminPages: string[] = [
  AppRoutes.admin.registration,
  AppRoutes.admin.registration_setting,
];
const adminPages = changePaths(_adminPages);

// only authenticated pages
const _authenticatedUserPages: string[] = [
  AppRoutes.home,
  AppRoutes.search,

  AppRoutes.profile.account_address,
  AppRoutes.profile.replies,
  AppRoutes.profile.following,
  AppRoutes.profile.followers,
  AppRoutes.profile.archived_posts,
  AppRoutes.settings.index,
  AppRoutes.settings.about,
  AppRoutes.settings.profile,
  AppRoutes.settings.social_links,
  AppRoutes.profile.nfts,
  AppRoutes.profile.owned,
  AppRoutes.profile.listed,
  AppRoutes.profile.created,
  AppRoutes.profile.collection,

  AppRoutes.feed.index,
  AppRoutes.feed.single_post,

  AppRoutes.notifications,

  AppRoutes.referral.network_genealogy,

  AppRoutes.marketplace.nft,

  AppRoutes.marketplace.explore,
  AppRoutes.marketplace.nfts,
  AppRoutes.marketplace.collections,
  AppRoutes.marketplace.collection,
  AppRoutes.marketplace.create_nft,
  AppRoutes.marketplace.create_collection,

  AppRoutes.launchpad,
];
const authenticatedUserPages = changePaths(_authenticatedUserPages);

// Coming soon pages - redirect to feed page
const _notReadyPages: string[] = [
  AppRoutes.settings.privacy,

  AppRoutes.referral.overview,
  AppRoutes.referral.network_rewards,

  AppRoutes.chat,
  AppRoutes.profits_dashboard,
  AppRoutes.voting_chain,
  AppRoutes.staking_packs,
  AppRoutes.liquidity_pool,

  AppRoutes.admin.index,
  AppRoutes.admin.staking_packs,
  AppRoutes.admin.create_staking_pack,
  AppRoutes.admin.update_staking_pack,
  AppRoutes.admin.influencer_requests,
  AppRoutes.admin.influencer_details,
  AppRoutes.admin.transactions,
  AppRoutes.admin.users,
  AppRoutes.admin.network_rewards,
  AppRoutes.admin.network_rewards_marketplace,

  AppRoutes.referral.liscense,
];
const notReadyPages = changePaths(_notReadyPages);

// Coming soon v2 pages - redirect to feed page
const _notReadyPagesv2: string[] = [];
const notReadyPagesv2 = changePaths(_notReadyPagesv2);
