import { useRouter } from "next/router";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { useGetRoundsInfo } from "@/web3/hooks/use.contracts.functions";

import BuyCentherWrapper from "../../_components/buy.centher.wrapper";
import { PresaleCardV2 } from "../../_components/presale.card.v2";
import { PurchaseCentherCardV2 } from "../../_components/purchase.centher.cardv2";

const BuyTokenPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { roundsInfo, refreshRoundsInfo } = useGetRoundsInfo();

  return (
    <div>
      <PresaleCardV2 roundInfo={roundsInfo[Number(router.query.round)]} />
      <PurchaseCentherCardV2
        roundInfo={roundsInfo[Number(router.query.round)]}
        refreshRoundsInfo={refreshRoundsInfo}
      />
    </div>
  );
};

BuyTokenPage.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Launchpad">
    <div
      className={`mx-auto min-h-screen w-full max-w-[1144px] bg-black-shade-3 pb-10 font-monto`}
    >
      <BuyCentherWrapper />
      {page}
    </div>
  </AllPagesWrapper>
);

export default BuyTokenPage;
