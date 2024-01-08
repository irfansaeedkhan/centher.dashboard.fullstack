import React, { useEffect, useState } from "react";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";
import { TabsWrapper } from "./_components";
import { LaunchpadCard } from "./_components/launchpad-card";
import {
  // LaunchpadData,
  LaunchpadDataType,
  PresaleDataType,
} from "./_components/launchpad-card-data";
import { useLaunchpad } from "@/hooks/launchpad";
import { formatEther } from "ethers/lib/utils";
import { SmartContractProvider } from "@/web3/blockchain/providers/smart.contract.provider";
import { customLog } from "@/utils/custom.log";
import axios from "axios";
import { formatIPFSUrl } from "@/utils/format.address";

const LaunchpadList: NextPageWithLayout = () => {
  const { sdk } = useLaunchpad();

  const [projects, setProjects] = useState<LaunchpadDataType[]>([]);

  useEffect(() => {
    (async () => {
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

        if (currentTimeInSecs < startSale) {
          saleStatus = "upcoming";
        } else if (currentTimeInSecs < endSale) {
          saleStatus = "live";
        } else {
          saleStatus = "ended";
        }

        let softcapInQuoteToken = 0;

        for (let i = 0; i < Number(item.roundDeep); i++) {
          softcapInQuoteToken +=
            (Number(item.roundInfos[i].tokensToSell) *
              Number(item.roundInfos[i].pricePerToken)) /
            1e18;
        }

        const progress =
          (Number(item.totalPurchasesInBuyingToken) /
            Number(softcapInQuoteToken)) *
          100;

        return {
          id: item.id,
          token_name: tokenDetails[i].token_name,
          token_symbol: tokenDetails[i].token_symbol,
          soft_cap: softcapInQuoteToken,
          lockup_time: item.roundInfos[0].lockMonths,
          liquidity: item.maxTokensToSell,
          launchpad_title: item.id,
          status: saleStatus,
          start_date: new Date(Number(item.roundInfos[0].startTime) * 1000),
          end_date: new Date(
            Number(item.roundInfos[roundLength].endTime) * 1000
          ),
          currentPurchasesValue: item.totalPurchasesInBuyingToken,
          fundType: item.fundType === 0 ? "BNB" : "BUSD",
          progress: progress !== 0 ? progress.toFixed(4).toString() : "0",
        };
      });

      setProjects(filtered);
    })();
  }, [sdk]);

  if (!projects) return;

  return (
    <div className="grid grid-cols-1 gap-5 fmd:grid-cols-2 flg:grid-cols-3">
      {/* {LaunchpadData.map((data, index) => (
        <LaunchpadCard key={index} {...data} />
      ))} */}

      {projects.map((data) => (
        <LaunchpadCard key={data.id} {...data} />
      ))}
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
