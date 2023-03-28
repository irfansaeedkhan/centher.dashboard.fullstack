import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { AppRoutes } from "@/constants/app.routes";
import Button from "@/components/button";

export const ProfileCommunityTabs: React.FC = ({}) => {
  const router = useRouter();

  return (
    <div className="mb-4 flex w-full justify-center space-x-2 rounded-2xl p-1.5 fsm:mb-6 fmd:justify-start [@media(max-width:370px)]:overflow-auto">
      <Link
        href={`/profile/${router.query.account_address}/community/followers`}
        className="w-full max-w-max"
      >
        <Button
          title={"Followers"}
          variant={`${
            router.pathname === AppRoutes.profile.followers ? "v1" : "v8"
          }`}
          className="fmd:px-6 fmd:py-2"
        />
      </Link>
      <Link
        href={`/profile/${router.query.account_address}/community/following`}
        className="w-full max-w-max"
      >
        <Button
          title={"Following"}
          variant={`${
            router.pathname === AppRoutes.profile.following ? "v1" : "v8"
          }`}
          className="fmd:px-6 fmd:py-2"
        />
      </Link>
    </div>
  );
};
