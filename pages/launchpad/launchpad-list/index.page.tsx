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

const LaunchpadList: NextPageWithLayout = () => {
  const { sdk } = useLaunchpad();

  const [projects, setProjects] = useState<LaunchpadDataType[]>([]);

  useEffect(() => {
    (async () => {
      if (!sdk) return;

      const result: PresaleDataType[] = await sdk.getPresales();
      console.log(result);

      let roundLength = 0;

      const filtered: LaunchpadDataType[] = result.map((item) => {
        roundLength = Number(item.roundDeep) - 1;
        return {
          id: item.id,
          soft_cap: item.minTokensToSell,
          lockup_time: item.roundInfos[0].lockMonths,
          liquidity: item.maxTokensToSell,
          launchpad_title: item.id,
          status: "live",
          end_date: new Date(
            Number(item.roundInfos[roundLength].endTime) * 1000
          ),
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
