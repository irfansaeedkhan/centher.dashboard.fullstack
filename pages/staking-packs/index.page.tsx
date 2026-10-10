import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { NextPageWithLayout } from "@/pages/_app.page";
import Button from "@/components/button";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { axiosApi369x } from "@/utils/axios/centher-api";
import { customLog } from "@/utils/custom.log";

interface StakingPool {
  id: string;
  name: string;
  apy: string;
  tvl: string;
  status: string;
  created_at: string;
}

const StakingPackPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [tab, setTab] = useState<"PackList" | "Activated">("PackList");
  const [pools, setPools] = useState<StakingPool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosApi369x
      .get<{ pools: StakingPool[] }>("/api/staking/pools")
      .then((res) => setPools(res.data.pools ?? []))
      .catch((e) => {
        customLog(["development", "staging"], "failed to load pools", e);
        setPools([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="stakingpack min-h-screen w-full bg-black-shade-3 font-monto">
      <h1 className="textGradient animationTextHeading pb-6 sm:text-2xl lg:text-[34px]">
        Staking Pack
      </h1>
      <div className="ToggleBtnsContainer mb-6 flex max-w-[428px] rounded-2xl bg-black-shade-6 p-1.5">
        <Button
          title={"Pack List"}
          variant={`${tab === "PackList" ? "primary" : "secondary"}`}
          onClick={() => {
            setTab("PackList");
          }}
        />
        <Button
          title={"Activated"}
          variant={`${tab === "Activated" ? "primary" : "secondary"}`}
          onClick={() => {
            setTab("Activated");
          }}
        />
      </div>
      {tab === "PackList" && (
        <div className="flex flex-wrap gap-5">
          {loading ? (
            <div className="flex w-full justify-center py-10">
              <Image
                src="/images/preloader.png"
                alt="Loading"
                width={48}
                height={48}
                className="h-12 w-12 object-cover"
              />
            </div>
          ) : pools.length === 0 ? (
            <p className="text-sm text-gray-shade-7">
              No staking pools are available right now.
            </p>
          ) : (
            pools.map((pool) => (
              <PoolCard
                key={pool.id}
                pool={pool}
                onStake={() => router.push("/staking")}
              />
            ))
          )}
        </div>
      )}
      {tab === "Activated" && (
        <div>
          <h1 className="text-base font-bold text-white lg:text-xl">
            Activated
          </h1>
          <p className="mt-4 max-w-md text-sm text-gray-shade-7">
            You have no activated staking packs yet. Staking happens on-chain
            from the Staking page — packs you activate there will appear here.
          </p>
          <Button
            title="Go to Staking"
            variant="primary"
            className="mt-6 max-w-[200px]"
            onClick={() => router.push("/staking")}
          />
        </div>
      )}
    </div>
  );
};

const PoolCard: React.FC<{ pool: StakingPool; onStake: () => void }> = ({
  pool,
  onStake,
}) => (
  <div className="stakingCard w-full max-w-[482px] overflow-hidden rounded-2xl bg-background-shade-3">
    <div className="flex items-center justify-between bg-background-shade-2 p-5">
      <h3 className="text-base font-bold text-white f2xl:text-lg">
        {pool.name}
      </h3>
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          pool.status === "active"
            ? "bg-green-500/20 text-green-400"
            : "bg-gray-500/20 text-gray-400"
        }`}
      >
        {pool.status}
      </span>
    </div>
    <div className="flex flex-col gap-5 pb-6 pt-8 sm:px-4 md:px-5">
      <div className="flex w-full gap-10">
        <div className="flex flex-col">
          <span className="text-xs text-gray-shade-7">APY</span>
          <span className="textGradient text-base font-semibold">
            {Number(pool.apy).toFixed(2)}%
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-shade-7">TVL</span>
          <span className="text-base font-semibold text-white">
            ${Number(pool.tvl).toLocaleString()}
          </span>
        </div>
      </div>
      <Button
        title={pool.status === "active" ? "Stake now" : "Coming soon"}
        variant="secondary"
        className="py-4"
        onClick={pool.status === "active" ? onStake : undefined}
      />
    </div>
  </div>
);

StakingPackPage.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Staking Packs">{page}</AllPagesWrapper>;
};

export default StakingPackPage;
