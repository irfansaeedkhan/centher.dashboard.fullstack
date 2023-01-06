import type { NextRequest } from "next/server";

import { ADMIN_ACCOUNT_ADDRESS } from "@/web3/constants/common";

import { getSessionUser } from "./get.session.user";

export const isAuthenticated = async (request: NextRequest) => {
  try {
    const sessionId = request.cookies.get("sid");
    // Get session user
    const user = await getSessionUser(sessionId?.value);

    return !!user;
  } catch {
    return false;
  }
};

export const isAdmin = async (request: NextRequest) => {
  try {
    const sessionId = request.cookies.get("sid");
    // Get session user
    const user = await getSessionUser(sessionId?.value);

    if (!user) return false;

    return (
      user.account_address.toLowerCase() === ADMIN_ACCOUNT_ADDRESS.toLowerCase()
    );
  } catch {
    return false;
  }
};
