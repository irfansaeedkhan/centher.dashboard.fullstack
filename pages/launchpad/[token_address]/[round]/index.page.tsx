import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { useGetRoundsInfo } from "@/web3/hooks/use.contracts.functions";
import {
  BuyCentherWrapper,
  PresaleCard,
  PurchaseCentherCard,
  RoundStats,
} from "./_components";

const Launchpad: NextPageWithLayout = () => {
  const router = useRouter();
  const round_number = router.query.round
    ? Number(router.query.round?.toString())
    : undefined;
  const { roundsInfo, refreshRoundsInfo } = useGetRoundsInfo();

  if (!round_number) return null;

  return roundsInfo[round_number - 1] ? (
    <div className="flex flex-col gap-5">
      <PresaleCard roundInfo={roundsInfo[round_number - 1]} />
      <RoundStats roundInfo={roundsInfo[round_number - 1]} />
      <PurchaseCentherCard
        roundInfo={roundsInfo[round_number - 1]}
        refreshRoundsInfo={refreshRoundsInfo}
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
