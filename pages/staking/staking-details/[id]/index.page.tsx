import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import ConnectWalletModal from "@/components/modal/connect-wallet-modal";
import useUser from "@/hooks/use.user";
import { useAutoRestake, useStaking } from "@/hooks/staking";
import { ZeroAddress } from "@/web3/constants/common";
import { setupUiModels } from "@/staking/helpers/mappers.helper";
import { RewardsStat } from "@/staking/types/rewards.interface";
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
  const { user } = useUser();
  const router = useRouter();
  const { sdk } = useStaking();
  const { getSigner, disconnectWallet, connectWallet, connectedAddress } =
    useWallet();
  const signer = getSigner();
  const [poolId, setPoolId] = useState("0");
  const [userStaked, setUserStaked] = useState<RewardsStat | null>(null);
  const [stakingPool, setStakingPool] = useState<ListCardDataOBj | null>(null);
  const [hasSwapping, setHasSwapping] = useState(false);
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [coinsDetails, setCoinsDetails] = useState<Array<CoinDetails>>([]);
  const { isAutoRestakeEnabled, handleToggleAutoRestake } = useAutoRestake(
    stakingPool?.id
  );

  const reloadPool = async () => {
    if (sdk && connectedAddress) {
      const pool = await sdk.getProject(+poolId, connectedAddress);
      if (pool) {
        const mappedPools = setupUiModels([pool]);
        setStakingPool(mappedPools[0]);
        return mappedPools[0];
      } else return null;
    }
  };
  const loadPoolData = async (force = false) => {
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
  };

  useEffect(() => {
    loadPoolData();
  }, [poolId, sdk, stakingPool, user]);

  useEffect(() => {
    const poolId = router.query.id as string;
    setPoolId(poolId);
  }, [router]);

  useEffect(() => {
    if (!signer) {
      setConnectWalletModal(true);
    } else {
      setConnectWalletModal(false);
    }
  }, [signer]);

  useEffect(() => {
    if (sdk && poolId && user && signer) {
      sdk.getUserStakes(signer!, +poolId, user._id).then((data) => {
        setUserStaked(data);
      });
    }
  }, [poolId, sdk, user, signer]);

  useEffect(() => {
    if (poolId) {
      setHasSwapping(SwappingProjects.includes(poolId));
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
      onClose={() => setConnectWalletModal(false)}
      open={connectWalletModal}
      loggedInUser={user}
      connectWallet={connectWallet}
      connectedAddress={connectedAddress}
      disconnectWallet={disconnectWallet}
      authType="login"
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
