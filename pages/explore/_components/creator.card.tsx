import { AppRoutes } from "@/constants/app.routes";
import useGetUser from "@/hooks/use.get.user";
import { LoadingState } from "@/models/common";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import TopCreators from "../../../components/loading.skeletons/top.creator";

interface CreatorCardProps {
  publicKey: string;
  loadingTopCreators: LoadingState;
}
const CreatorCard = ({ publicKey, loadingTopCreators }: CreatorCardProps) => {
  const { user } = useGetUser(publicKey);
  return (
    <div className="flex gap-3 items-center min-w-[122px]">
      {loadingTopCreators === "loading" || loadingTopCreators === "idle" ? (
        <TopCreators />
      ) : (
        <>
          <Image
            src={`/images/a1.png`}
            width={48}
            height={48}
            alt="profile"
            className="!w-12 !h-12 object-cover"
          />
          <div className={`flex flex-col gap-[2px]`}>
            <Link
              href={{
                pathname: AppRoutes.profile.nfts,
                query: {
                  account_address: user?.account_address,
                },
              }}
            >
              <p className="text-sm font-medium text-white hover:text-brand-primary-dark">
                {user?.display_name}
              </p>
            </Link>
            {/* <p className="text-xs text-gray-shade-7">Tradesr</p> */}
          </div>
        </>
      )}
      {/* {(loadingTopCreators === "loading" || loadingTopCreators === "idle") && (
        <TopCreators />
      )} */}
    </div>
  );
};

export default CreatorCard;
