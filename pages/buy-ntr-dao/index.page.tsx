// React, Next, NPM Packages
import { useEffect, useState } from "react";
import ctl from "@netlify/classnames-template-literals";
import { useWeb3React } from "@web3-react/core";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { RoundState, RoundInfo } from "@/web3/constants/types";
import {
  useBusdAllowance,
  useBusdBalance,
  useGetPurchasedInfo,
  useGetRoundInfo,
  useIsRegistered,
  useNtrdaoBalance,
  useRoundState,
} from "@/web3/hooks/use.contracts.functions";

// Current page imports
import { PresaleCard, PurchaseNTRDAOCard } from "./_components";

const BuyNTRDAOPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState<"PackList" | "Activated">("PackList");
  const roundInfo: RoundInfo[] | undefined = useGetRoundInfo();
  const [reload, setReload] = useState(false);
  const { account, library } = useWeb3React();
  const isRegistered = useIsRegistered(account);
  const ntrdaoBalance = useNtrdaoBalance(account);
  const busdBalance = useBusdBalance(account, reload);
  const busdAllowance = useBusdAllowance(account);
  const [isApproved, setApproved] = useState(false);
  const purchasedInfoResponse = useGetPurchasedInfo(account, reload);
  const roundState = useRoundState();

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
    <div className={dashboardContentContainer}>
      <h1 className={title}>Buy NTRDAO</h1>
      <div className={daoMainContentContainer}>
        <PresaleCard
          round={RoundState.Round1}
          roundInfo={roundInfo ? roundInfo[RoundState.Round1] : null}
          roundState={roundState}
        />
        <PurchaseNTRDAOCard
          round={RoundState.Round1}
          roundInfo={
            roundInfo?.length === 3 ? roundInfo[RoundState.Round1] : null
          }
          ntrdaoBalance={ntrdaoBalance}
          busdBalance={busdBalance}
          busdAllowance={busdAllowance}
          purchasedInfoResponse={
            purchasedInfoResponse.length === 3
              ? purchasedInfoResponse[RoundState.Round1]
              : null
          }
          roundState={roundState}
          isApproved={isApproved}
          setApproved={setApproved}
          reload={reload}
          setReload={setReload}
        />
        <PresaleCard
          round={RoundState.Round2}
          roundInfo={roundInfo ? roundInfo[RoundState.Round2] : null}
          roundState={roundState}
        />
        <PurchaseNTRDAOCard
          round={RoundState.Round2}
          roundInfo={
            roundInfo?.length === 3 ? roundInfo[RoundState.Round2] : null
          }
          ntrdaoBalance={ntrdaoBalance}
          busdBalance={busdBalance}
          busdAllowance={busdAllowance}
          purchasedInfoResponse={
            purchasedInfoResponse.length === 3
              ? purchasedInfoResponse[RoundState.Round2]
              : null
          }
          roundState={roundState}
          isApproved={isApproved}
          setApproved={setApproved}
          reload={reload}
          setReload={setReload}
        />
        <PresaleCard
          round={RoundState.Round3}
          roundInfo={roundInfo ? roundInfo[RoundState.Round3] : null}
          roundState={roundState}
        />
        <PurchaseNTRDAOCard
          round={RoundState.Round3}
          roundInfo={
            roundInfo?.length === 3 ? roundInfo[RoundState.Round3] : null
          }
          ntrdaoBalance={ntrdaoBalance}
          busdBalance={busdBalance}
          busdAllowance={busdAllowance}
          purchasedInfoResponse={
            purchasedInfoResponse.length === 3
              ? purchasedInfoResponse[RoundState.Round3]
              : null
          }
          roundState={roundState}
          isApproved={isApproved}
          setApproved={setApproved}
          reload={reload}
          setReload={setReload}
        />
      </div>
    </div>
  );
};

BuyNTRDAOPage.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Buy NTRDAO">{page}</AllPagesWrapper>
);

export default BuyNTRDAOPage;

// styling
const dashboardContentContainer = ctl(`
  bg-black-shade-3 w-full max-w-[1144px] min-h-screen font-monto mx-auto pb-10
`);
const title = ctl(`
  textGradient leading-[42px] pb-6 animationTextHeading lg:text-[34px] sm:text-2xl 
`);
const daoMainContentContainer = ctl(`
flex flex-col gap-5
`);
