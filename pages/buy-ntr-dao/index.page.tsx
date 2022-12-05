import { useGetRoundsInfo } from "@/web3/hooks/use.contracts.functions";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

import { PresaleCard, PurchaseNTRDAOCard } from "./_components";

const BuyNTRDAOPage: NextPageWithLayout = () => {
  const roundsInfo = useGetRoundsInfo();

  return (
    <div
      className={`bg-black-shade-3 w-full max-w-[1144px] min-h-screen font-monto mx-auto pb-10`}
    >
      <h1
        className={`textGradient leading-[42px] pb-6 animationTextHeading lg:text-[34px] sm:text-2xl`}
      >
        Buy NTRDAO
      </h1>

      <div className={`space-y-5`}>
        {roundsInfo.map((roundInfo) => (
          <>
            <PresaleCard roundInfo={roundInfo} />
            <PurchaseNTRDAOCard roundInfo={roundInfo} />
          </>
        ))}
      </div>
    </div>
  );
};

BuyNTRDAOPage.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Buy NTRDAO">{page}</AllPagesWrapper>
);

export default BuyNTRDAOPage;
