import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  changePaths,
  checkMatch,
  hasValidSession,
  isAdmin,
  isAuthenticated,
  isCitizen,
} from "@/utils/middleware.helpers";
import { AppRoutes } from "@/constants/app.routes";

export async function middleware(request: NextRequest) {
  // Dev-only pages: not found in production/staging.
  if (checkMatch(request.nextUrl, devOnlyPages)) {
    if (
      process.env.NEXT_PUBLIC_APP_ENV === "production" ||
      process.env.NEXT_PUBLIC_APP_ENV === "staging"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/404";
      return NextResponse.rewrite(url);
    }
  }

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

  // Only-public pages (login/register): validate the session for real instead
  // of trusting cookie presence. A dead-but-present session cookie must NOT
  // bounce the user to /feed — the login form has to stay reachable so the
  // trap can never form, no matter what the client does. Fail open to the
  // presence-based check if the validator itself is unreachable.
  if (checkMatch(request.nextUrl, onlyPublicPages)) {
    const validSession = await hasValidSession(request);
    const authenticated =
      validSession === undefined
        ? await isAuthenticated(request)
        : validSession;
    if (authenticated) {
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

// Dev-only pages (hardcoded test payloads) — 404 in production/staging.
// Phase 9: /ui-test and /stream are developer tools, not user features.
const _devOnlyPages: string[] = ["/ui-test", "/stream"];
const devOnlyPages = changePaths(_devOnlyPages);

// Admin Only Pages
const _adminPages: string[] = [
  AppRoutes.admin.index,
  AppRoutes.admin.staking_packs,
  AppRoutes.admin.create_staking_pack,
  AppRoutes.admin.update_staking_pack,
  AppRoutes.admin.users,
  AppRoutes.admin.network_rewards,
  AppRoutes.admin.network_rewards_marketplace,
  AppRoutes.admin.network_rewards_UpdateContract,
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

  AppRoutes.launchpad.index,
  AppRoutes.launchpad.create_launchpad,
  AppRoutes.launchpad.launchpad_list.index,
  AppRoutes.launchpad.launchpad_list.launchpad_list_details,

  AppRoutes.staking.index,
  AppRoutes.staking.staking_details.index,
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

// Coming soon pages - redirect to the coming-soon page in production/staging.
// Phase 9: reconciled — /staking-packs (Phase 7), /network-rewards/license
// (Phase 7 typo fix), and all /admin/* (Phase 8) are real pages now and were
// removed from this list. The remaining entries are genuinely not ready
// (missing pages or unverified).
const _notReadyPages: string[] = [
  AppRoutes.referral.network_genealogy,
  AppRoutes.referral.overview,
  AppRoutes.referral.network_rewards,

  AppRoutes.profits_dashboard,
  AppRoutes.voting_chain,
  AppRoutes.liquidity_pool,
];
const notReadyPages = changePaths(_notReadyPages);
