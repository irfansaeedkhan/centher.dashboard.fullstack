import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  changePaths,
  checkMatch,
  isAdmin,
  isAuthenticated,
  isNFTBlacklisted,
  isCitizen,
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

  // Check if the URL collection and tokenId are blacklisted
  if (isNFTBlacklisted(request.nextUrl.pathname)) {
    const url = request.nextUrl.origin + "/not-found";
    return NextResponse.redirect(url);
  }

  // Citizen Only Pages
  if (checkMatch(request.nextUrl, citizenOnlyPages)) {
    if (!(await isCitizen(request))) {
      return NextResponse.redirect(
        `${request.nextUrl.origin}${AppRoutes.citizenship}`
      );
    } else {
      return NextResponse.next();
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

// Only Public Pages - logged in user can not access these pages
const _onlyPublicPages: string[] = [
  AppRoutes.auth.login,
  AppRoutes.auth.register,
];
const onlyPublicPages = changePaths(_onlyPublicPages);

// Public or Authenticated Pages
const _publicOrAuthenticatedPages: string[] = [AppRoutes.terms];
const publicOrAuthenticatedPages = changePaths(_publicOrAuthenticatedPages);

// Admin Only Pages
const _adminPages: string[] = [
  AppRoutes.admin.registration,
  AppRoutes.admin.registration_setting,
];
const adminPages = changePaths(_adminPages);

// Authenticated pages
const _authenticatedUserPages: string[] = [
  AppRoutes.home,
  AppRoutes.search,
  AppRoutes.notifications,
  AppRoutes.recommended,
  AppRoutes.citizenship,

  AppRoutes.profile.user_id,
  AppRoutes.profile.replies,
  AppRoutes.profile.following,
  AppRoutes.profile.followers,
  AppRoutes.profile.archived_posts,
  AppRoutes.profile.team,
  AppRoutes.profile.referrals,
  AppRoutes.profile.nfts,
  AppRoutes.profile.owned,
  AppRoutes.profile.listed,
  AppRoutes.profile.created,
  AppRoutes.profile.collection,

  AppRoutes.settings.index,
  AppRoutes.settings.about,
  AppRoutes.settings.profile,
  AppRoutes.settings.social_links,
  AppRoutes.settings.privacy,
  AppRoutes.settings.team,

  AppRoutes.chat.index,
  AppRoutes.chat.single_chat,

  AppRoutes.feed.index,
  AppRoutes.feed.single_post,

  AppRoutes.marketplace.nft,
  AppRoutes.marketplace.explore,
  AppRoutes.marketplace.collections,
  AppRoutes.marketplace.collection,

  AppRoutes.launchpad,

  AppRoutes.staking.index,
  AppRoutes.staking.staking_details.index,
  AppRoutes.staking.staking_details.rewards,
  AppRoutes.staking.staking_details.referrals,
  AppRoutes.staking.staking_details.project_details,

  AppRoutes.staking.faqs,
];
const authenticatedUserPages = changePaths(_authenticatedUserPages);

// Citizen only pages
const _citizenOnlyPages: string[] = [
  AppRoutes.marketplace.create_nft,
  AppRoutes.marketplace.create_collection,

  AppRoutes.settings.citizen.team_members,

  AppRoutes.staking.create_staking,
];
const citizenOnlyPages = changePaths(_citizenOnlyPages);

// Coming soon pages - redirect to feed page
const _notReadyPages: string[] = [
  AppRoutes.referral.network_genealogy,
  AppRoutes.referral.overview,
  AppRoutes.referral.network_rewards,
  AppRoutes.referral.liscense,

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
  AppRoutes.admin.network_rewards_UpdateContract,
];
const notReadyPages = changePaths(_notReadyPages);
