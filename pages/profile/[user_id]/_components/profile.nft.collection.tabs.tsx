import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { AppRoutes } from "@/constants/app.routes";
import FinalButton from "@/components/button/final.button";

export const ProfileNFTCollectionTabs: React.FC = ({}) => {
  const router = useRouter();

  return (
    <div className="mb-4 flex w-full space-x-2 rounded-2xl p-1.5 fsm:mb-6 fsm:max-w-[530px] [@media(max-width:370px)]:overflow-auto">
      <Link
        href={{
          pathname: AppRoutes.profile.created,
          query: { user_id: router.query.user_id },
        }}
      >
        <FinalButton
          title="Created"
          variant={`${
            router.pathname === AppRoutes.profile.created
              ? "primary"
              : "secondary"
          }`}
          className="mb-3 h-10 w-[150px] text-[14px] hover:scale-95"
          borderRounded="14px"
        />
      </Link>

      <Link
        href={{
          pathname: AppRoutes.profile.owned,
          query: { user_id: router.query.user_id },
        }}
      >
        <FinalButton
          title="Owned"
          variant={`${
            router.pathname === AppRoutes.profile.owned
              ? "primary"
              : "secondary"
          }`}
          className="mb-3 h-10 w-[150px] text-[14px] hover:scale-95"
          borderRounded="14px"
        />
      </Link>

      <Link
        href={{
          pathname: AppRoutes.profile.listed,
          query: { user_id: router.query.user_id },
        }}
      >
        <FinalButton
          title="Listed"
          variant={`${
            router.pathname === AppRoutes.profile.listed
              ? "primary"
              : "secondary"
          }`}
          className="mb-3 h-10 w-[150px] text-[14px] hover:scale-95"
          borderRounded="14px"
        />
      </Link>

      <Link
        href={{
          pathname: AppRoutes.profile.collection,
          query: { user_id: router.query.user_id },
        }}
      >
        <FinalButton
          title="Collections"
          variant={`${
            router.pathname === AppRoutes.profile.collection
              ? "primary"
              : "secondary"
          }`}
          className="mb-3 h-10 w-[150px] text-[14px] hover:scale-95"
          borderRounded="14px"
        />
      </Link>
    </div>
  );
};
