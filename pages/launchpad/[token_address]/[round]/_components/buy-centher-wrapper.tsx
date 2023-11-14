import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiCopy } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { copyText } from "@/utils/copy.text";
import { AppRoutes } from "@/constants/app.routes";
import Button from "@/components/button";
import { sliceAccountAddress } from "@/utils/user.helpers";

export const BuyCentherWrapper = () => {
  const router = useRouter();
  const token_address = router.query.token_address?.toString();
  if (!token_address) return null;

  return (
    <div className="mb-6 flex flex-col items-center justify-between fsm:mb-5 fmd:flex-row">
      <div className="flex justify-center space-x-2 p-1.5 fmd:justify-start [@media(max-width:370px)]:overflow-auto">
        <Link
          href={{
            pathname: AppRoutes.launchpad,
            query: {
              token_address,
              round: 1,
            },
          }}
        >
          <Button
            className=""
            title="Round 1"
            variant={router.query.round === "1" ? "primary" : "secondary"}
          />
        </Link>
        <Link
          href={{
            pathname: AppRoutes.launchpad,
            query: {
              token_address,
              round: 2,
            },
          }}
        >
          <Button
            className="rounded-[14px]"
            title="Round 2"
            variant={router.query.round === "2" ? "primary" : "secondary"}
            borderRounded="14px"
          />
        </Link>
        <Link
          href={{
            pathname: AppRoutes.launchpad,
            query: {
              token_address,
              round: 3,
            },
          }}
        >
          <Button
            className="rounded-[14px]"
            title="Round 3"
            variant={router.query.round === "3" ? "primary" : "secondary"}
            borderRounded="14px"
          />
        </Link>
      </div>
      <div className="mt-4 flex flex-col items-center gap-2 fsm:mt-0 fsm:flex-row">
        <h3 className="min-w-fit max-w-max text-base text-white">
          Token Contract Address
        </h3>
        <Button
          className="h-8 px-[10px] text-sm"
          title={sliceAccountAddress(token_address)}
          variant="primary"
          borderRounded="10px"
          IconEnd={
            <FiCopy
              className="z-50 h-5 w-5 text-white"
              onClick={async () => {
                await copyText(token_address);
                toast.success("Contract Address copied!");
              }}
            />
          }
        />
      </div>
    </div>
  );
};
