import type { NextRequest } from "next/server";

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

const ADMIN_ACCOUNT_ADDRESS =
  process.env.NEXT_PUBLIC_APP_ENV === "production"
    ? "0x6BE98e964CdEfB66Dbc724aF25B4Bdcc8075D801"
    : "0xcBe3a6B073d1460Cc642fC686769A2EB6aF32fa7";

export const isAdmin = async (request: NextRequest) => {
  try {
    const sessionId = request.cookies.get("sid");
    // Get session user
    const user = await getSessionUser(sessionId?.value);

    if (!user) return false;


    //TO DO: Must be commented or removed before going to production
    return (true)
    //TO DO: Must be uncommented before going to production
    // return (
    //   user.account_address.toLowerCase() === ADMIN_ACCOUNT_ADDRESS.toLowerCase()
    // );
  } catch {
    return false;
  }
};
