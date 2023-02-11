import { useGetRoundsInfo } from "@/web3/hooks/use.contracts.functions";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

import { PresaleCard, PurchaseCentherCard, RoundStats } from "./_components";
import LaunchpadSkeleton from "@/components/loading.skeletons/launchpad.skeleton";

const BuyNTRDAOPage: NextPageWithLayout = () => {
  const { roundsInfo, refreshRoundsInfo } = useGetRoundsInfo();

  return (
    <div
      className={`mx-auto min-h-screen w-full max-w-[1144px] bg-black-shade-3 pb-10 font-monto`}
    >
      {!!roundsInfo.length ? (
        <div className={`space-y-5`}>
          {roundsInfo.map((roundInfo) => (
            <div key={roundInfo.round} className={`space-y-5`}>
              <PresaleCard roundInfo={roundInfo} />
              {/* Only show if the round is started / ended */}
              {(roundInfo.status === "active" ||
                roundInfo.status === "ended") && (
                <RoundStats roundInfo={roundInfo} />
              )}
              <PurchaseCentherCard
                roundInfo={roundInfo}
                refreshRoundsInfo={refreshRoundsInfo}
              />
            </div>
          ))}
        </div>
      ) : (
        <LaunchpadSkeleton />
      )}
    </div>
  );
};

BuyNTRDAOPage.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Buy CENTHER">{page}</AllPagesWrapper>
);

export default BuyNTRDAOPage;
