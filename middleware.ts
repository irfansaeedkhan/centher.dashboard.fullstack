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
        `${request.nextUrl.origin}${AppRoutes.home}`
      );
    }
  }

  if (authenticatedAndActiveUserPages.includes(request.nextUrl.pathname)) {
    const user = await getUser(sessionId);
    if (!user) {
      return NextResponse.redirect(
        `${request.nextUrl.origin}${AppRoutes.auth.login}`
      );
    }

    if (user.status === "registration_fee_pending") {
      return NextResponse.redirect(
        `${request.nextUrl.origin}${AppRoutes.auth.pay_registration_fee}`
      );
    }
  }

  if (request.nextUrl.pathname === AppRoutes.auth.pay_registration_fee) {
    const user = await getUser(sessionId);
    if (!user) {
      return NextResponse.redirect(
        `${request.nextUrl.origin}${AppRoutes.auth.login}`
      );
    }

    if (user.status !== "registration_fee_pending") {
      return NextResponse.redirect(
        `${request.nextUrl.origin}${AppRoutes.home}`
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

// only public pages
const onlyPublicPages: string[] = [
  AppRoutes.auth.login,
  AppRoutes.auth.register,
];

// only authenticated pages
const authenticatedAndActiveUserPages: string[] = [
  AppRoutes.feed,
  AppRoutes.chat,
  AppRoutes.notifications,
  AppRoutes.create_collection,
  AppRoutes.staking_packs,
  AppRoutes.network_rewards,
  AppRoutes.buy_ntr_dao,
  AppRoutes.profits_dashboard,
  AppRoutes.voting_chain,
  AppRoutes.referral_program,
];
