import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";
import { useLaunchpad } from "@/hooks/launchpad";
import { formatIPFSUrl } from "@/utils/format.address";
import { TabsWrapper } from "./_components";
import {
  LaunchpadDataType,
  PresaleDataType,
} from "./_components/launchpad-card-data";
import { LaunchpadCard } from "./_components/launchpad-card";
import Image from "next/image";
import { EmptyLaunchpad } from "@/assets/svgs/launchpad-v2";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";

const LaunchpadList: NextPageWithLayout = () => {
  const router = useRouter();
  const { list_type, sort } = router.query;
  const { sdk } = useLaunchpad();

  const [projects, setProjects] = useState<LaunchpadDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSdk = useCallback(async () => {
    setIsLoading(true);
    if (!sdk) return;

    const result: PresaleDataType[] = await sdk.getPresales();
    let tokenDetails: {
      token_name: string;
      token_symbol: string;
    }[] = [];

    for (let i = 0; i < result.length; i++) {
      const metaData = await axios.get(formatIPFSUrl(result[i].metadata));
      const { token_name, token_symbol } = metaData.data;

      tokenDetails.push({ token_name, token_symbol });
    }

    let roundLength = 0;

    const filtered: LaunchpadDataType[] = result.map((item, i) => {
      roundLength = Number(item.roundDeep) - 1;

      const startSale = Number(item.roundInfos[0].startTime);
      const endSale = Number(item.roundInfos[roundLength].endTime);

      let saleStatus: string;
      let currentTimeInSecs = Number(new Date()) / 1000;

      // check active round
      let currentRound = -1;

      const nowTime = Number((Date.now() / 1000).toFixed());

      if (item.roundInfos[0]) {
        if (nowTime < Number(item.roundInfos[0].startTime)) {
          currentRound = -1; // any round is not started
        } else if (
          nowTime >= Number(item.roundInfos[0].startTime) &&
          nowTime < Number(item.roundInfos[0].endTime)
        ) {
          currentRound = 1; // in round 1
        }
      }
      if (item.roundInfos[0] && item.roundInfos[1]) {
        if (
          nowTime >= Number(item.roundInfos[0].endTime) &&
          nowTime < (item.roundInfos[1] && Number(item.roundInfos[1].startTime))
        ) {
          currentRound = -2; // round 2 is not started
        } else if (
          nowTime >=
            (item.roundInfos[1] && Number(item.roundInfos[1].startTime)) &&
          nowTime < Number(item.roundInfos[1].endTime)
        ) {
          currentRound = 2; // in round 2
        }
      }

      if (item.roundInfos[0] && item.roundInfos[1] && item.roundInfos[2]) {
        if (
          nowTime >= Number(item.roundInfos[1].endTime) &&
          nowTime < Number(item.roundInfos[2].startTime)
        ) {
          currentRound = -3; // round 3 is not started
        } else if (
          nowTime >= Number(item.roundInfos[2].startTime) &&
          nowTime < Number(item.roundInfos[2].endTime)
        ) {
          currentRound = 3; // in round 3
        }
      } else if (
        item.roundInfos[2] &&
        nowTime >= Number(item.roundInfos[2].endTime)
      ) {
        currentRound = -4; // all round is ended
      }

      if (currentTimeInSecs < startSale) {
        saleStatus = "upcoming";
      } else if (currentTimeInSecs < endSale) {
        saleStatus = "live";
      } else {
        saleStatus = "ended";
      }

      let avgPrice = BigNumber.from(0);

      for (let i = 0; i < Number(item.roundDeep); i++) {
        const pricePerToken = BigNumber.from(item.roundInfos[i].pricePerToken);
        avgPrice = pricePerToken.add(BigNumber.from(avgPrice));
      }

      avgPrice = avgPrice.div(BigNumber.from(item.roundDeep));

      const minTokensSellInQuote = avgPrice
        .mul(item.minTokensToSell)
        .div(BigNumber.from(parseEther("1")));
      const maxTokensSellInQuote = avgPrice
        .mul(item.maxTokensToSell)
        .div(BigNumber.from(parseEther("1")));

      const progress =
        (Number(item.totalPurchasesInBuyingToken) /
          Number(maxTokensSellInQuote)) *
        100;

      return {
        id: item.id,
        token_name: tokenDetails[i].token_name,
        token_symbol: tokenDetails[i].token_symbol,
        soft_cap: maxTokensSellInQuote,
        lockup_time: item.roundInfos[0].lockMonths,
        liquidity: item.maxTokensToSell,
        launchpad_title: item.id,
        status: saleStatus,
        start_date: new Date(Number(item.roundInfos[0].startTime) * 1000),
        end_date: new Date(Number(item.roundInfos[roundLength].endTime) * 1000),
        currentPurchasesValue: item.totalPurchasesInBuyingToken,
        fundType: item.fundType === 0 ? "BNB" : "BUSD",
        progress: progress !== 0 ? progress.toFixed(4).toString() : "0",
        currentRound: currentRound,
        totalRounds: item.roundInfos.length,
        minTokensToSell: minTokensSellInQuote,
        maxTokensToSell: maxTokensSellInQuote,
      };
    });

    if (list_type === "all") {
      if (sort === "asc") {
        setProjects(
          filtered.sort((a, b) => (a.token_name < b.token_name ? -1 : 1))
        );
      } else if (sort === "dsc") {
        setProjects(
          filtered.sort((a, b) => (a.token_name < b.token_name ? 1 : -1))
        );
      } else {
        setProjects(filtered);
      }
    }

    if (list_type === "live") {
      const liveFilter = filtered.filter((item) => item.status === "live");
      if (sort === "asc") {
        setProjects(
          liveFilter.sort((a, b) => (a.token_name < b.token_name ? -1 : 1))
        );
      } else if (sort === "dsc") {
        setProjects(
          liveFilter.sort((a, b) => (a.token_name < b.token_name ? 1 : -1))
        );
      } else {
        setProjects(liveFilter);
      }
    }

    if (list_type === "upcoming") {
      const upcomingFilter = filtered.filter(
        (item) => item.status === "upcoming"
      );

      if (sort === "asc") {
        setProjects(
          upcomingFilter.sort((a, b) => (a.token_name < b.token_name ? -1 : 1))
        );
      } else if (sort === "dsc") {
        setProjects(
          upcomingFilter.sort((a, b) => (a.token_name < b.token_name ? 1 : -1))
        );
      } else {
        setProjects(upcomingFilter);
      }
    }
    setIsLoading(false);
  }, [list_type, sdk, sort]);

  useEffect(() => {
    loadSdk();
  }, [loadSdk]); //sdk, list_type

  if (!projects) return;

  if (isLoading) {
    return (
      <div className="mt-10 flex w-full items-center justify-center">
        <Image
          src="/images/preloader.png"
          alt="Preloader"
          width={64}
          height={64}
          className="h-16 w-16 flex-shrink-0 object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`gap-5 ${
        projects.length === 0
          ? ""
          : "grid grid-cols-1 fmd:grid-cols-2 flg:grid-cols-3"
      }`}
    >
      {projects.length === 0 ? (
        <div className="mt-20 flex flex-col items-center justify-center gap-3">
          <EmptyLaunchpad className="h-[96px] w-[176px]" />
          <div className="text-base font-semibold text-white">
            No launchpad on list
          </div>
          <div className="text-sm font-normal text-[#A0A4BB]">
            No launchpads are currently listed, All live
            <div className="text-sm font-normal text-[#A0A4BB]">
              and upcoming launches will be featured here.
            </div>
          </div>
        </div>
      ) : (
        projects.map((data) => <LaunchpadCard key={data.id} {...data} />)
      )}
    </div>
  );
};

LaunchpadList.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Launchpad List">
    <div className="mx-auto min-h-screen w-full max-w-[1112px] bg-black-shade-3 pb-10 font-monto">
      <TabsWrapper>{page}</TabsWrapper>
    </div>
  </AllPagesWrapper>
);

export default LaunchpadList;
