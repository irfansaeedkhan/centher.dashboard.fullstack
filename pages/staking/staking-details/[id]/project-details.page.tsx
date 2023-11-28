import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { formatIPFSUrl } from "@/utils/format.address";
import { ZeroAddress } from "@/web3/constants/common";
import { setupUiModels } from "@/staking/helpers/mappers.helper";
import { useStaking } from "@/hooks/staking";
import Details from "./_components/details";
import { ListCardDataOBj } from "../../_components/list-card-data";
import StakingMainWrapper from "../../_components/staking-main-wrapper";

const ProjectDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const { sdk } = useStaking();
  const [poolId, setPoolId] = useState("0");
  const [stakingPool, setStakingPool] = useState<ListCardDataOBj | null>(null);
  const [isLoading, setIsLoading] = useState("idle");

  useEffect(() => {
    const poolId = router.query.id as string;
    setPoolId(poolId);
  }, [poolId, router]);

  useEffect(() => {
    const getPoolMetadata = async (address: string) => {
      try {
        const metadata = await axios.get(formatIPFSUrl(address));
        if (stakingPool && metadata.data) {
          stakingPool.metadata = metadata.data;
          setStakingPool(stakingPool);
        }
      } catch (error) {}
      setIsLoading("loaded");
    };

    if (stakingPool && !stakingPool.metadata) {
      getPoolMetadata(stakingPool.metadataUrl).then();
    }
  }, [stakingPool]);

  useEffect(() => {
    const getCoinDetails = async (tokens: string[]) => {
      const list: string[] = [];
      tokens.filter(Boolean).forEach((e) => {
        if (e != ZeroAddress && list.indexOf(e) == -1) {
          list.push(e);
        }
      });
    };
    if (!stakingPool && poolId && sdk) {
      setIsLoading("loading");
      sdk.getProject(+poolId).then((pool) => {
        if (pool) {
          getCoinDetails([pool.stakeToken, pool.rewardToken]).then();
          const mappedPools = setupUiModels([pool]);
          setStakingPool(mappedPools[0]);
        }
      });
    }
  }, [stakingPool, poolId, sdk]);

  return isLoading === "loaded" ? (
    <div className="mx-auto h-auto w-full rounded-xl border border-gray-shade-3 bg-black-shade-9 p-4 fxm:p-6">
      <Details data={stakingPool} />
    </div>
  ) : isLoading === "loading" ? (
    <div className="flex h-[calc(100vh-60px)] w-full items-center justify-center">
      <Image
        src="/images/preloader.png"
        alt="preloader"
        width={64}
        height={64}
        className="h-16 w-16 flex-shrink-0 object-cover"
      />
    </div>
  ) : null;
};

ProjectDetails.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Project Details">
      <StakingMainWrapper>{page}</StakingMainWrapper>
    </AllPagesWrapper>
  );
};

export default ProjectDetails;
