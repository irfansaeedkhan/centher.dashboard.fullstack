import { URLPattern } from "next/server";
import { NextURL } from "next/dist/server/web/next-url";

export const checkMatch = (nextUrl: NextURL, paths: string[]) => {
  return paths.some((p) => {
    const pattern = new URLPattern({ pathname: p });
    return pattern.test(nextUrl);
  });
};
