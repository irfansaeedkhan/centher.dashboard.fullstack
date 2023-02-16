import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";

import { AppRoutes } from "@/constants/app.routes";
import Button from "@/components/button";

interface ProfileProps {
  account_address: string | string[] | undefined;
}

export const ProfileNFTCollectionTabs: React.FC = ({}) => {
  const router = useRouter();

  return (
    <div className="mb-4 flex w-full space-x-2 rounded-2xl bg-black-shade-6 p-1.5 fsm:mb-6 fsm:max-w-[430px]">
      <Link
        href={`/profile/${router.query.account_address}/nfts/owned`}
        className="w-full"
      >
        <Button
          title={"Owned"}
          variant={`${
            router.pathname === AppRoutes.profile.owned ? "v1" : "v2"
          }`}
          className="fsm:px-8 fsm:py-3"
        />
      </Link>

      <Link
        href={`/profile/${router.query.account_address}/nfts/created`}
        className="w-full"
      >
        <Button
          title={"Created"}
          variant={`${
            router.pathname === AppRoutes.profile.created ? "v1" : "v2"
          }`}
          className="fsm:px-8 fsm:py-3"
        />
      </Link>
      <Link
        href={`/profile/${router.query.account_address}/nfts/collection`}
        className="w-full"
      >
        <Button
          title={"Collections"}
          variant={`${
            router.pathname === AppRoutes.profile.collection ? "v1" : "v2"
          }`}
          className="fsm:px-8 fsm:py-3"
        />
      </Link>
    </div>
  );
};
