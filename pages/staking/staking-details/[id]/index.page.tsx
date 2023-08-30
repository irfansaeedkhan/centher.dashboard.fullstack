import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BiLockAlt } from "react-icons/bi";
import { IoWalletOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { formatUnits } from "ethers/lib/utils";
import { useWeb3React } from "@web3-react/core";
import { FiArrowRight } from "react-icons/fi";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import useUser from "@/hooks/use.user";
import { useStaking } from "@/hooks/staking";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { ZeroAddress } from "@/web3/constants/common";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { setupUiModels } from "@/staking/helpers/mappers.helper";
import { RewardsStat } from "@/staking/types/rewards.interface";
import { fetchTokenMetadata } from "@/hooks/use.token.metadata";
import { eqAddress } from "@/live/utils/address.utils";
import { PreLoader } from "@/components/pre.loader";
import { MetamaskIcon2 } from "@/assets/svgs";
import { CustomNewModal } from "@/components/modal/custom.new.modal";
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import StakingDetailsWrapper from "./_components/staking-details-wrapper";
import { ListCardDataOBj } from "../../_components/list-card-data";

const StakingDetails: NextPageWithLayout = () => {
  const { user } = useUser();
  const router = useRouter();
  const { sdk } = useStaking();
  const [poolId, setPoolId] = useState("0");
  const [userStaked, setUserStaked] = useState<RewardsStat | null>(null);
  const [stakingPool, setStakingPool] = useState<ListCardDataOBj | null>(null);
  const [coinsDetails, setCoinsDetails] = useState<
    Array<CoinDetails | undefined>
  >([]);
  const { connectWallet } = useConnectWallet();
  const [connectWalletModal, setConnectWalletModal] = useState(false);

  const [expireTime, setExpireTime] = useState(0);
  const { library, deactivate } = useWeb3React();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCoinDetails = async (tokens: string[]) => {
      const list: string[] = [];
      tokens.filter(Boolean).forEach((e) => {
        if (e != ZeroAddress && list.indexOf(e) == -1) {
          list.push(e);
        }
      });

      if (list.length > 0) {
        const details = await fetchTokenMetadata(list);
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

    if (!stakingPool && poolId && sdk) {
      setIsLoading(true);
      sdk.getProject(+poolId).then((pool) => {
        if (pool) {
          getCoinDetails([pool.stakeToken, pool.rewardToken]).then();
          const mappedPools = setupUiModels([pool]);
          setStakingPool(mappedPools[0]);
          setIsLoading(false);
        }
        //else {//redirect to index}
      });
    }
  }, [stakingPool, poolId, sdk]);

  useEffect(() => {
    const poolId = router.query.id as string;
    setPoolId(poolId);
  }, [poolId, router]);

  useEffect(() => {
    if (!library) {
      setConnectWalletModal(true);
    } else {
      setConnectWalletModal(false);
    }
  }, [library]);

  useEffect(() => {
    if (sdk && poolId && user && library) {
      sdk.getUserStakes(library, +poolId, user._id).then((data) => {
        setUserStaked(data);
      });
    }
  }, [poolId, sdk, user, library]);

  useEffect(() => {
    if (stakingPool) {
      const transfers = stakingPool.transfers
        ?.filter((e) => e.type == "stake")
        .sort((a, b) => a.endAt - b.endAt);
      if (transfers?.length) {
        setExpireTime(transfers[0].endAt);
      } else setExpireTime(+new Date() / 1000);
    }
  }, [stakingPool]);

  return (
    <div className="w-full rounded-xl border border-gray-shade-3 bg-black-shade-9 p-6">
      <div className="text-[min(10vw, 20px)] textGradient font-semibold">
        My Staking overview
      </div>
      <div className="scrollSetLight2 mt-5 flex max-w-full flex-grow gap-5 overflow-x-auto">
        <div className="flex h-[96px] min-w-[352px] gap-4 rounded-xl bg-elevation-1 px-5 py-6">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-brand-primary/60 bg-brand-primary/10">
            <IoWalletOutline className="h-[18px] w-[18px] text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-shade-14">
              Wallet Balance
            </p>
            <p className="mt-[6px] font-semibold text-white">
              {
                +normalizeValue(
                  formatUnits(
                    userStaked ? userStaked.totalClaimableReward : 0 + "",
                    coinsDetails.find((e) =>
                      eqAddress(
                        stakingPool?.reward_token_address,
                        e?.contractAddress
                      )
                    )?.decimals
                  )
                )
              }{" "}
              {
                coinsDetails.find((e) =>
                  eqAddress(
                    stakingPool?.reward_token_address,
                    e?.contractAddress
                  )
                )?.symbol
              }
            </p>
          </div>
        </div>
        <div className="flex h-[96px] min-w-[352px] gap-4 rounded-xl bg-elevation-1 px-5 py-6">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[#D35DB9]/60 bg-[#D35DB9]/10">
            <BiLockAlt className="h-[18px] w-[18px] text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-shade-14">
              Locked Token
            </p>
            <p className="mt-[6px] font-semibold text-white">
              {
                +normalizeValue(
                  formatUnits(
                    userStaked ? userStaked.totalStakeAmount : 0 + "",
                    coinsDetails.find((e) =>
                      eqAddress(
                        stakingPool?.reward_token_address,
                        e?.contractAddress
                      )
                    )?.decimals
                  )
                )
              }{" "}
              {
                coinsDetails.find((e) =>
                  eqAddress(stakingPool?.token_address, e?.contractAddress)
                )?.symbol
              }
            </p>
          </div>
        </div>
        <div className="flex h-[96px] min-w-[352px] gap-4 rounded-xl bg-elevation-1 px-5 py-6">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[#5F97FF]/60 bg-[#5F97FF]/10">
            <BiLockAlt className="h-[18px] w-[18px] text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-shade-14">
              Locker Expiration
            </p>
            <p className="mt-[6px] font-semibold text-white">
              {new Date(expireTime * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      {connectWalletModal && (
        <CustomNewModal
          onClose={() => {
            setConnectWalletModal(false);
          }}
          title={"Connect to wallet"}
        >
          <div className="mb-8 flex w-full justify-center px-5 md:px-10">
            <p className="mt-2 w-full max-w-[366px] text-center text-sm text-gray-shade-14">
              Please Connect your wallet to continue, the system support
              following wallet.
            </p>
          </div>
          <div className="flex w-full justify-center px-5 md:px-10">
            <div className="flex w-full max-w-[400px] items-center justify-between gap-10 rounded-xl border border-brand-primary px-5 py-3">
              <div className="flex items-center gap-3 fsm:gap-6">
                <MetamaskIcon2 />
                <h3 className="text-sm font-semibold text-white fmd:text-base">
                  Metamask
                </h3>
              </div>
              <button
                onClick={async () => {
                  if (!user) {
                    toast.error("Please login to buy this membership");
                    setConnectWalletModal(false);
                    return;
                  }
                  const _account = await connectWallet();
                  if (user._id.toLowerCase() !== _account?.toLowerCase()) {
                    toast.error("Please connect to correct account");
                    deactivate();
                  }
                  setConnectWalletModal(false);
                }}
              >
                <FiArrowRight className="h-6 w-6 text-brand-primary fsm:h-8 fsm:w-8" />
              </button>
            </div>
          </div>
        </CustomNewModal>
      )}
      {!connectWalletModal && (isLoading || !userStaked) ? <PreLoader /> : ""}
    </div>
  );
};

StakingDetails.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Staking Details">
      <StakingDetailsWrapper>{page}</StakingDetailsWrapper>
    </AllPagesWrapper>
  );
};

export default StakingDetails;
