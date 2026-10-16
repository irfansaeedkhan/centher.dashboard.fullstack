import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";
import { DetailsTabsWrapper } from "./_components/details-tabs-wrapper";
import { PresaleDataType } from "../_components/launchpad-card-data";
import { BookingList, LaunchpadOverview, ReferralRewards } from "./_components";
import { axiosApi369x } from "@/utils/axios/centher-api";
import { customLog } from "@/utils/custom.log";

interface RestLaunchpadDetail {
  id: string;
  name: string;
  symbol: string;
  status: string;
  raised: string;
  soft_cap: string;
  created_at: string;
}

/**
 * QA-fix: the old code read presale detail from the TheGraph subgraph, which
 * is unreachable (requests hang) — and the catch block never cleared
 * `loading`, so the page spun the preloader forever. Detail now loads from
 * the working backend `/api/launchpads/:id` and adapts it to the
 * PresaleDataType shape the overview components expect. Loading always
 * resolves; failures render an honest error instead of an infinite spinner.
 */
const adaptToPresale = (lp: RestLaunchpadDetail): PresaleDataType => {
  const createdAtSec = Math.floor(new Date(lp.created_at).getTime() / 1000);
  const endAtSec = createdAtSec + 30 * 24 * 3600;
  // QA-fix: BigNumber fields must be integer strings — backend numerics come
  // back as decimals ("500000.00").
  const intStr = (v: string | undefined) =>
    Math.floor(Number(v) || 0).toString();
  const softCap = intStr(lp.soft_cap);
  const raised = intStr(lp.raised);
  return {
    id: lp.id,
    token: lp.id,
    creator: "",
    owner: "",
    fundType: 0,
    minTokensToSell: "0",
    maxTokensToSell: softCap,
    isRefSupport: false,
    levelOne: "0",
    levelTwo: "0",
    levelThree: "0",
    levelFour: "0",
    levelFive: "0",
    levelSix: "0",
    coinFeeRate: "0",
    tokenFeeRate: "0",
    releaseMonth: "0",
    refundAmount: "0",
    metadata: "",
    isActive: lp.status === "live",
    totalPurchasesInBuyingToken: raised,
    // QA-fix: roundDeep is 1-indexed (PresaleData does roundInfos[roundDeep-1]).
    roundDeep: "1",
    roundInfos: [
      {
        token: lp.id,
        startTime: String(createdAtSec),
        endTime: String(endAtSec),
        lockMonths: "0",
        minContribution: "0",
        maxContribution: softCap,
        tokensToSell: softCap,
        pricePerToken: "0",
      },
    ],
    tokenPurchaseWithBNB: [],
    tokenPurchaseWithBUSD: [],
  } as unknown as PresaleDataType;
};

const LaunchpadListDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const { id, list_type } = router.query;
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [launchpadData, setLaunchpadData] = useState<PresaleDataType>();
  const [metaData, setMetaData] = useState<{
    token_name: string;
    token_symbol: string;
    website: string;
    description: string;
  }>();

  const loadLaunchpad = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const { data } = await axiosApi369x.get<RestLaunchpadDetail>(
        `/api/launchpads/${id.toString()}`
      );
      setLaunchpadData(adaptToPresale(data));
      setMetaData({
        token_name: data.name,
        token_symbol: data.symbol,
        website: "",
        description: "",
      });
    } catch (err) {
      customLog(["development", "staging"], err);
      setLoadError("Could not load this launchpad. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadLaunchpad();
  }, [loadLaunchpad]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-60px)] w-full items-center justify-center">
        <Image
          src="/images/preloader.png"
          alt="Loading launchpad"
          width={64}
          height={64}
          className="size-16 flex-shrink-0 object-cover"
        />
      </div>
    );
  }

  if (loadError || !launchpadData || !metaData) {
    return (
      <div className="flex h-[calc(100vh-60px)] w-full flex-col items-center justify-center gap-3">
        <p className="text-base font-semibold text-white">
          {loadError || "Launchpad not found."}
        </p>
        <button
          type="button"
          onClick={() => loadLaunchpad()}
          className="bg-brand-primary rounded-lg px-5 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return list_type === "launchpad_overview" ? (
    <LaunchpadOverview
      launchpadData={launchpadData}
      metaData={metaData}
      loadSdk={loadLaunchpad}
    />
  ) : list_type === "booking_list" ? (
    <BookingList
      {...launchpadData}
      token_name={metaData.token_name}
      token_symbol={metaData.token_symbol}
    />
  ) : list_type === "referral_rewards" ? (
    <ReferralRewards launchpadData={launchpadData} metaData={metaData} />
  ) : null;
};

LaunchpadListDetails.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Launchpad List">
    <DetailsTabsWrapper>{page}</DetailsTabsWrapper>
  </AllPagesWrapper>
);

export default LaunchpadListDetails;
