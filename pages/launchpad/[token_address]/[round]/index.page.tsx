import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import useUser from "@/hooks/use.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { useGetRoundsInfo } from "@/web3/hooks/use.contracts.functions";
import { BuyCentherWrapper, PurchaseCentherCard } from "./_components";

const Launchpad: NextPageWithLayout = () => {
  const { user } = useUser();
  const router = useRouter();
  const round_number = router.query.round
    ? Number(router.query.round?.toString())
    : undefined;
  const { roundsInfo } = useGetRoundsInfo();
  if (!round_number) return null;

  return roundsInfo[round_number - 1] ? (
    <div className="flex flex-col gap-5">
      <PurchaseCentherCard
        round_number={round_number - 1}
        currentUserAddress={user?._id}
        roundInfo={roundsInfo[round_number - 1]}
      />
    </div>
  ) : (
    <div className="flex h-[calc(100vh-60px)] w-full items-center justify-center">
      <Image
        src="/images/preloader.png"
        alt="Chat Background"
        width={64}
        height={64}
        className="h-16 w-16 flex-shrink-0 object-cover"
      />
    </div>
  );
};

Launchpad.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Launchpad">
    <div className="mx-auto min-h-screen w-full max-w-[1144px] bg-black-shade-3 pb-10 font-monto">
      <BuyCentherWrapper />
      {page}
    </div>
  </AllPagesWrapper>
);

export default Launchpad;
