import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { useGetRoundsInfo } from "@/web3/hooks/use.contracts.functions";

import { PurchaseCentherCardV2 } from "../../_components/purchase-centher-card-v2";
import LaunchpadComingSoon from "../../_components/lauchpad.comingsoon";
import { AppRoutes } from "@/constants/app.routes";

const BuyTokenPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { roundsInfo, refreshRoundsInfo } = useGetRoundsInfo();

  return (
    <div>
      {/* <PresaleCardV2 roundInfo={roundsInfo[Number(router.query.round)]} /> */}
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
      {/* <BuyCentherWrapper /> */}
      <LaunchpadComingSoon />
      {page}
    </div>
  </AllPagesWrapper>
);

export default BuyTokenPage;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: AppRoutes.launchpad_pre_booking,
      permanent: false,
    },
  };
};
