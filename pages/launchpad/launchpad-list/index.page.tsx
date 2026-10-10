import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";
import { TabsWrapper } from "./_components";
import { LaunchpadDataType } from "./_components/launchpad-card-data";
import { LaunchpadCard } from "./_components/launchpad-card";
import { EmptyLaunchpad } from "@/assets/svgs/launchpad-v2";
import { BigNumber } from "ethers";
import { axiosApi369x } from "@/utils/axios/centher-api";
import { customLog } from "@/utils/custom.log";

interface RestLaunchpad {
  id: string;
  name: string;
  symbol: string;
  status: string;
  raised: string;
  soft_cap: string;
  created_at: string;
}

const LaunchpadList: NextPageWithLayout = () => {
  const router = useRouter();
  const { list_type, sort } = router.query;

  const [projects, setProjects] = useState<LaunchpadDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLaunchpads = useCallback(async () => {
    setIsLoading(true);
    try {
      const type =
        list_type === "live" || list_type === "upcoming" ? list_type : "all";
      const { data } = await axiosApi369x.get<{
        launchpads: RestLaunchpad[];
      }>("/api/launchpads", { params: { list_type: type } });

      const mapped: LaunchpadDataType[] = (data.launchpads ?? []).map(
        (item) => ({
          id: item.id,
          token_name: item.name,
          token_symbol: item.symbol,
          status: item.status,
          launchpad_title: item.name,
          liquidity: item.raised,
          lockup_time: "-",
          soft_cap: BigNumber.from(
            Math.floor(Number(item.soft_cap) || 0).toString()
          ),
          currentPurchasesValue: item.raised,
          fundType: "BNB",
          progress: item.soft_cap
            ? ((Number(item.raised) / Number(item.soft_cap)) * 100)
                .toFixed(2)
                .toString()
            : "0",
          currentRound: item.status === "live" ? 1 : 0,
          totalRounds: 1,
          minTokensToSell: BigNumber.from("0"),
          maxTokensToSell: BigNumber.from(
            Math.floor(Number(item.soft_cap) || 0).toString()
          ),
          start_date: new Date(item.created_at),
        })
      );

      if (sort === "asc") {
        mapped.sort((a, b) => (a.token_name < b.token_name ? -1 : 1));
      } else if (sort === "dsc") {
        mapped.sort((a, b) => (a.token_name < b.token_name ? 1 : -1));
      }
      setProjects(mapped);
    } catch (e) {
      customLog(["development", "staging"], "failed to load launchpads", e);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [list_type, sort]);

  useEffect(() => {
    loadLaunchpads();
  }, [loadLaunchpads]);

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
