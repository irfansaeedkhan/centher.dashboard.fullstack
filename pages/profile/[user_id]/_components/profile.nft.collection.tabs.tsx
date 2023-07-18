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
        href={{
          pathname: AppRoutes.profile.created,
          query: { user_id: router.query.user_id },
        }}
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
        href={{
          pathname: AppRoutes.profile.owned,
          query: { user_id: router.query.user_id },
        }}
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
        href={{
          pathname: AppRoutes.profile.listed,
          query: { user_id: router.query.user_id },
        }}
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
        href={{
          pathname: AppRoutes.profile.collection,
          query: { user_id: router.query.user_id },
        }}
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
