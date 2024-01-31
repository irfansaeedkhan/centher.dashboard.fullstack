import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import ConnectWalletModal from "@/components/modal/connect-wallet-modal";
import useUser from "@/hooks/use.user";
import { useAutoRestake, useStaking } from "@/hooks/staking";
import { ZeroAddress } from "@/web3/constants/common";
import { setupUiModels } from "@/staking/helpers/mappers.helper";
import { SwappingProjects } from "@/staking/config";
import { useWallet } from "@/web3/hooks/use.wallet";
import { ListCardDataOBj } from "../../_components/list-card-data";
import StakingDetailsTop from "./_components/staking-details-top";
import StakingMainWrapper from "../../_components/staking-main-wrapper";
import { DexSwapping } from "./_components/swapping/dex-swapping";
import { RewardsTabs } from "./_components/reward-components";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { fetchTokenMetadata } from "@/hooks/use.token.metadata";

const StakingDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const { user } = useUser();
  const { sdk } = useStaking();
  const [stakingPool, setStakingPool] = useState<ListCardDataOBj | null>(null);
  const [hasSwapping, setHasSwapping] = useState(false);
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [coinsDetails, setCoinsDetails] = useState<Array<CoinDetails>>([]);
  const { isAutoRestakeEnabled, handleToggleAutoRestake } = useAutoRestake(
    stakingPool?.id
  );
  const poolId = useMemo(() => {
    return router.query.id?.toString() ? +router.query.id.toString() : 0;
  }, [router]);
  const { getSigner, connectWallet, connectedAddress } = useWallet();
  const signer = getSigner();

  const reloadPool = useCallback(async () => {
    if (sdk && connectedAddress) {
      const pool = await sdk.getProject(+poolId, connectedAddress);
      if (pool) {
        const mappedPools = setupUiModels([pool]);
        setStakingPool(mappedPools[0]);
        return mappedPools[0];
      } else return null;
    } else {
      setIsLoading(false);
      setConnectWalletModal(true);
    }
  }, [poolId, sdk, connectedAddress]);

  const loadPoolData = useCallback(
    async (force = false) => {
      const getCoinDetails = async (tokens: string[]) => {
        const list: string[] = [];
        tokens.filter(Boolean).forEach((e) => {
          if (e != ZeroAddress && list.indexOf(e) == -1) {
            list.push(e);
          }
        });

        const details = await fetchTokenMetadata(list);
        if (details?.length) {
          const tokenDetails = details.map((e: any) => e.token._value);
          setCoinsDetails(
            tokenDetails.map((e: any) => {
              return {
                ...e,
                contractAddress: e.contractAddress._value,
                chain: e.chain._value,
              };
            })
          );
        }
      };

      if ((!stakingPool || force) && poolId && sdk && user) {
        setIsLoading(true);
        setStakingPool(null);
        reloadPool().then((pool) => {
          if (pool) {
            getCoinDetails([
              pool.token_address,
              pool.reward_token_address,
            ]).then();
            setIsLoading(false);
          }
        });
      }
    },
    [poolId, sdk, stakingPool, user, reloadPool]
  );

  useEffect(() => {
    loadPoolData();
  }, [loadPoolData]);

  useEffect(() => {
    if (!signer) {
      setConnectWalletModal(true);
    } else {
      setConnectWalletModal(false);
    }
  }, [signer]);

  useEffect(() => {
    if (poolId) {
      setHasSwapping(SwappingProjects.includes(poolId.toString()));
    }
  }, [poolId]);

  return isLoading ? (
    <div className="flex h-[calc(100vh-60px)] w-full items-center justify-center">
      <Image
        src="/images/preloader.png"
        alt="preloader"
        width={64}
        height={64}
        className="h-16 w-16 flex-shrink-0 object-cover"
      />
    </div>
  ) : connectWalletModal ? (
    <ConnectWalletModal
      open={connectWalletModal}
      authType="login"
      connectWallet={connectWallet}
      onClose={() => setConnectWalletModal(false)}
    />
  ) : stakingPool ? (
    <>
      <StakingDetailsTop
        setConnectWalletModal={setConnectWalletModal}
        stakingPool={stakingPool}
        coinsDetails={coinsDetails}
        reload={reloadPool}
      />
      {hasSwapping && <DexSwapping />}
      {stakingPool && (
        <RewardsTabs
          pool={stakingPool}
          coins={coinsDetails}
          reloadPool={reloadPool}
          isAutoRestakeEnabled={isAutoRestakeEnabled}
          handleToggleAutoRestake={handleToggleAutoRestake}
        />
      )}
    </>
  ) : null;
};

StakingDetails.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Staking Details">
      <StakingMainWrapper>{page}</StakingMainWrapper>
    </AllPagesWrapper>
  );
};

export default StakingDetails;
