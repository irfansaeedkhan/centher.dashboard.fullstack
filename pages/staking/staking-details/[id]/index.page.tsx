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
import { useWeb3ModalState } from "@web3modal/ethers5/react";

const StakingDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const { user } = useUser();
  const { sdk } = useStaking();
  const [stakingPool, setStakingPool] = useState<ListCardDataOBj | null>(null);
  const [hasSwapping, setHasSwapping] = useState(false);
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  // Portfolio-library fix (Centher item 4): dismissing the wallet gate
  // must STICK. The old page re-opened the modal from two effects
  // whenever no wallet was connected, so even a working close control
  // would have been undone immediately and the modal kept covering
  // sidebar navigation. While dismissed, the route renders a
  // wallet-required notice with a working back path instead of nothing.
  const [walletGateDismissed, setWalletGateDismissed] = useState(false);
  const closeWalletModal = useCallback(() => {
    setConnectWalletModal(false);
    setWalletGateDismissed(true);
  }, []);
  // Same (value: boolean) => void contract StakingDetailsTop expects,
  // but an explicit open clears the dismissed flag so the user can
  // deliberately re-open the gate after dismissing it.
  const setConnectWalletModalGate = useCallback((value: boolean) => {
    if (value) setWalletGateDismissed(false);
    else setWalletGateDismissed(true);
    setConnectWalletModal(value);
  }, []);
  const [isLoading, setIsLoading] = useState(true);
  const [coinsDetails, setCoinsDetails] = useState<Array<CoinDetails>>([]);
  const { isAutoRestakeEnabled, handleToggleAutoRestake } = useAutoRestake(
    stakingPool?.id
  );
  const { open, selectedNetworkId } = useWeb3ModalState();
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
      if (!walletGateDismissed) {
        setConnectWalletModal(true);
      }
    }
  }, [poolId, sdk, connectedAddress, walletGateDismissed]);

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
    if (!signer && !connectedAddress && !open) {
      if (!walletGateDismissed) {
        setConnectWalletModal(true);
      }
    } else {
      setConnectWalletModal(false);
      // A connected wallet clears the dismissed flag so the gate can
      // work normally again after a disconnect/reconnect cycle.
      if (signer || connectedAddress) {
        setWalletGateDismissed(false);
      }
    }
  }, [signer, connectedAddress, open, walletGateDismissed]);

  useEffect(() => {
    if (poolId) {
      setHasSwapping(SwappingProjects.includes(poolId.toString()));
    }
  }, [poolId]);

  // Dismissed gate + no pool data: show the notice, never a blank page
  // and never the modal again, so sidebar navigation stays usable.
  // No wallet is connected here and no transaction is attempted.
  if (walletGateDismissed && !stakingPool) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-white">
          Wallet required to view this staking pool
        </h2>
        <p className="max-w-[480px] text-sm font-normal leading-6 text-gray-shade-14">
          Pool details load from your connected wallet. You closed the
          wallet-connect dialog, so nothing is connected and no pool data
          can be shown yet.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/staking")}
            className="rounded-lg bg-brand-primary px-5 py-2 text-sm font-semibold text-white"
          >
            Back to staking
          </button>
          <button
            type="button"
            onClick={() => setConnectWalletModalGate(true)}
            className="rounded-lg border border-gray-shade-3 px-5 py-2 text-sm font-semibold text-white"
          >
            Connect wallet
          </button>
        </div>
      </div>
    );
  }

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
      onClose={closeWalletModal}
      allowDismiss
    />
  ) : stakingPool ? (
    <>
      <StakingDetailsTop
        setConnectWalletModal={setConnectWalletModalGate}
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
