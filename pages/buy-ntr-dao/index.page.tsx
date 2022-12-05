// React, Next, NPM Packages
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { RoundState, RoundInfo } from "@/web3/constants/types";
import {
  useGetBusdAllowance,
  useBusdBalance,
  useGetPurchasedInfo,
  useGetRoundInfo,
  useIsRegistered,
  useNtrdaoBalance,
  useGetRoundState,
} from "@/web3/hooks/use.contracts.functions";

// Current page imports
import { PresaleCard, PurchaseNTRDAOCard } from "./_components";

const BuyNTRDAOPage: NextPageWithLayout = () => {
  const { account, library } = useWeb3React();
  const roundState = useGetRoundState();
  const roundInfo = useGetRoundInfo();

  const [reload, setReload] = useState(false);
  const isRegistered = useIsRegistered(account);
  const ntrdaoBalance = useNtrdaoBalance(account);
  const busdBalance = useBusdBalance(account, reload);
  const busdAllowance = useGetBusdAllowance(account);
  const [isApproved, setApproved] = useState(false);
  const purchasedInfoResponse = useGetPurchasedInfo(account, reload);

  useEffect(() => {
    const compareAllowance = async () => {
      if (busdAllowance !== 0 && busdAllowance >= busdBalance) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    };
    if (account) {
      compareAllowance();
    }
  }, [busdAllowance, busdBalance, account]);

  return (
    <div
      className={`bg-black-shade-3 w-full max-w-[1144px] min-h-screen font-monto mx-auto pb-10`}
    >
      <h1
        className={`textGradient leading-[42px] pb-6 animationTextHeading lg:text-[34px] sm:text-2xl`}
      >
        Buy NTRDAO
      </h1>
      <div className={`flex flex-col gap-5`}>
        {roundInfo && (
          <>
            <PresaleCard
              currentRound={1}
              roundInfo={roundInfo[0]}
              roundStatus={
                roundState === RoundState.RoundsNotStarted
                  ? "not-started"
                  : roundState === RoundState.Round1Started
                  ? "active"
                  : roundState >= RoundState.Round2NotStarted
                  ? "ended"
                  : undefined
              }
            />
            <PurchaseNTRDAOCard
              roundStatus={
                roundState === RoundState.RoundsNotStarted
                  ? "not-started"
                  : roundState === RoundState.Round1Started
                  ? "active"
                  : roundState >= RoundState.Round2NotStarted
                  ? "ended"
                  : undefined
              }
              roundInfo={roundInfo[0]}
              // currentRound={1}
              // ntrdaoBalance={ntrdaoBalance}
              // busdBalance={busdBalance}
              // busdAllowance={busdAllowance}
              // purchasedInfoResponse={purchasedInfoResponse[0]}
              // roundState={roundState}
              // isApproved={isApproved}
              // setApproved={setApproved}
              // reload={reload}
              // setReload={setReload}
            />

            <PresaleCard
              roundStatus={
                roundState <= RoundState.Round2NotStarted
                  ? "not-started"
                  : roundState === RoundState.Round2Started
                  ? "active"
                  : roundState >= RoundState.Round3NotStarted
                  ? "ended"
                  : undefined
              }
              currentRound={2}
              roundInfo={roundInfo[1]}
            />
            <PurchaseNTRDAOCard
              roundStatus={
                roundState <= RoundState.Round2NotStarted
                  ? "not-started"
                  : roundState === RoundState.Round2Started
                  ? "active"
                  : roundState >= RoundState.Round3NotStarted
                  ? "ended"
                  : undefined
              }
              roundInfo={roundInfo[1]}
              // currentRound={2}
              // ntrdaoBalance={ntrdaoBalance}
              // busdBalance={busdBalance}
              // busdAllowance={busdAllowance}
              // purchasedInfoResponse={purchasedInfoResponse[1]}
              // roundState={roundState}
              // isApproved={isApproved}
              // setApproved={setApproved}
              // reload={reload}
              // setReload={setReload}
            />

            <PresaleCard
              roundStatus={
                roundState <= RoundState.Round3NotStarted
                  ? "not-started"
                  : roundState === RoundState.Round3Started
                  ? "active"
                  : roundState >= RoundState.RoundsEnded
                  ? "ended"
                  : undefined
              }
              currentRound={3}
              roundInfo={roundInfo[2]}
            />
            <PurchaseNTRDAOCard
              roundStatus={
                roundState <= RoundState.Round3NotStarted
                  ? "not-started"
                  : roundState === RoundState.Round3Started
                  ? "active"
                  : roundState >= RoundState.RoundsEnded
                  ? "ended"
                  : undefined
              }
              roundInfo={roundInfo[2]}
              // currentRound={3}
              // ntrdaoBalance={ntrdaoBalance}
              // busdBalance={busdBalance}
              // busdAllowance={busdAllowance}
              // purchasedInfoResponse={purchasedInfoResponse[2]}
              // roundState={roundState}
              // isApproved={isApproved}
              // setApproved={setApproved}
              // reload={reload}
              // setReload={setReload}
            />
          </>
        )}
      </div>
    </div>
  );
};

BuyNTRDAOPage.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Buy NTRDAO">{page}</AllPagesWrapper>
);

export default BuyNTRDAOPage;
