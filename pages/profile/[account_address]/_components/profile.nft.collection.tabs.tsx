import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { AppRoutes } from "@/constants/app.routes";
import Button from "@/components/button";

export const ProfileNFTCollectionTabs: React.FC = ({}) => {
  const router = useRouter();

  return (
    <div className="mb-4 flex w-full space-x-2 rounded-2xl p-1.5 fsm:mb-6 fsm:max-w-[530px] [@media(max-width:370px)]:overflow-auto">
      <Link
        href={`/profile/${router.query.account_address}/nfts/created`}
        className="w-full"
      >
        <Button
          title={"Created"}
          variant={`${
            router.pathname === AppRoutes.profile.created ? "v1" : "v8"
          }`}
          className="fsm:px-6 fsm:py-2"
        />
      </Link>
      <Link
        href={`/profile/${router.query.account_address}/nfts/owned`}
        className="w-full"
      >
        <Button
          title={"Owned"}
          variant={`${
            router.pathname === AppRoutes.profile.owned ? "v1" : "v8"
          }`}
          className="fsm:px-6 fsm:py-2"
        />
      </Link>
      <Link
        href={`/profile/${router.query.account_address}/nfts/listed`}
        className="w-full"
      >
        <Button
          title={"Listed"}
          variant={`${
            router.pathname === AppRoutes.profile.listed ? "v1" : "v8"
          }`}
          className="fsm:px-6 fsm:py-2"
        />
      </Link>
      <Link
        href={`/profile/${router.query.account_address}/nfts/collection`}
        className="w-full"
      >
        <Button
          title={"Collections"}
          variant={`${
            router.pathname === AppRoutes.profile.collection ? "v1" : "v8"
          }`}
          className="fsm:px-6 fsm:py-2"
        />
      </Link>
    </div>
  );
};
