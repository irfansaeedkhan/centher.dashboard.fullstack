import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CgSpinner } from "react-icons/cg";
import { AiOutlineInfoCircle } from "react-icons/ai";

import FinalButton from "@/components/button/final.button";
import useUser from "@/hooks/use.user";
import { usePreBookingStats } from "@/hooks/use-pre-booking-stats";
import { AppRoutes } from "@/constants/app.routes";
import StakeNow, { StakingStat } from "./stake-now";
import Details from "./details";
import PageButtonsWrapper from "./page-buttons";
import { useStaking } from "@/hooks/staking";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { setupUiModels } from "@/staking/helpers/mappers.helper";
import { ZeroAddress } from "@/web3/constants/common";
import { formatIPFSUrl } from "@/utils/format.address";
import axios from "axios";
import { ListCardDataOBj } from "@/pages/staking/_components/list-card-data";
import { PreLoader } from "@/components/pre.loader";
import { formatUnits, isAddress, parseEther } from "ethers/lib/utils";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { useWeb3React } from "@web3-react/core";
import { fetchTokenMetadata } from "@/hooks/use.token.metadata";
import { eqAddress } from "@/live/utils/address.utils";
import { CustomModal } from "@/components/modal/custom.modal";
import { ModalWrapper } from "@/components/modal";
import { IModalHandler, ModalManager, TemplateCollection } from "@/utils/modal";
import SuccessModalContent from "./success-modal-content";
import FailedModalContent from "./failed-modal-content";

const oneYearInSec = 365 * 24 * 60 * 60;

interface Props {
  children?: React.ReactNode;
}

enum ModalType {
  successFuncModal = "successFuncModal",
  failedFuncModal = "failedFuncModal",
}

const StakingDetailsWrapper = ({ children }: Props) => {
  const { library } = useWeb3React();
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });
  const { sdk } = useStaking();
  const [poolId, setPoolId] = useState("0");
  const [activeTab, setActiveTab] = useState("index");
  const { user } = useUser();
  const [stakingStat, setStakingStat] = useState<StakingStat | null>(null);
  const [coinsDetails, setCoinsDetails] = useState<
    Array<CoinDetails | undefined>
  >([]);
  const [userDetails, setUserDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stakingPool, setStakingPool] = useState<ListCardDataOBj | null>(null);
  const [rewardEstimation, setRewardEstimation] = useState<{
    claim: number;
    total: number;
  } | null>(null);
  const [stakingValue, setStakingValue] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const poolId = router.query.id as string;
    setPoolId(poolId);
  }, [poolId, router]);

  useEffect(() => {
    if (router.pathname.includes("rewards")) {
      setActiveTab("rewards");
    } else if (router.pathname.includes("referrals")) {
      setActiveTab("referrals");
    } else {
      setActiveTab("index");
    }
  }, [activeTab, router]);

  useEffect(() => {
    const getPoolMetadata = async (address: string) => {
      try {
        const metadata = await axios.get(formatIPFSUrl(address));
        if (stakingPool && metadata.data) {
          stakingPool.metadata = metadata.data;
          setStakingPool(stakingPool);
        }
      } catch (error) {}
      setIsLoading(false);
    };

    if (stakingPool && !stakingPool.metadata) {
      getPoolMetadata(stakingPool.metadataUrl).then();
    }

    if (stakingPool && !stakingStat) {
      setStakingStat({
        totalStakedAmount: formatUnits(
          stakingPool.totalStakedAmount
            ? stakingPool.totalStakedAmount + ""
            : "0",
          18
        ),
        totalStakingCap: stakingPool.supply,
        tokenAddress: stakingPool.token_address,
      });
    }
  }, [stakingPool]);

  useEffect(() => {
    const getCoinDetails = async (tokens: string[]) => {
      const list: string[] = [];
      tokens.forEach((e) => {
        if (e != ZeroAddress && list.indexOf(e) == -1) {
          list.push(e);
        }
      });

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
    };

    if (!stakingPool && poolId && sdk) {
      setIsLoading(true);
      sdk.getProject(+poolId).then((pool) => {
        if (pool) {
          getCoinDetails([pool.stakeToken, pool.rewardToken]).then();
          const mappedPools = setupUiModels([pool]);
          setStakingPool(mappedPools[0]);
        }
        //else {//redirect to index}
      });
    }
  }, [stakingPool, poolId, sdk]);

  useEffect(() => {
    if (stakingPool) {
      const total =
        +stakingPool.apy *
        stakingValue *
        (+stakingPool.staking_period / oneYearInSec);

      const claim =
        +stakingPool.apy *
        stakingValue *
        (+stakingPool.claim_period / oneYearInSec);

      setRewardEstimation({
        total: +formatUnits(total + "", 18).toString(),
        claim: +formatUnits(claim + "", 18).toString(),
      });
    }
  }, [stakingValue]);

  const stakingValueChanges = (value: number) => {
    setStakingValue(+parseEther(normalizeValue(value) + "").toString());
  };

  const stakeSubmit = async (referrer: string) => {
    try {
      if (sdk && poolId && stakingValue > 0) {
        if (referrer != ZeroAddress && !isAddress(referrer)) {
          throw new Error("Invalid referrer error");
        }

        await sdk.stake(library, +poolId, referrer, stakingValue + "");
        //TODO=> show success modal
        modal.createModal(ModalType.successFuncModal);
      } else {
        throw new Error("Invalid params");
      }
    } catch (error) {
      console.log(error);
      //TODO=> show error modal
      modal.createModal(ModalType.failedFuncModal);
    }
  };

  const modalTemplateCollection: TemplateCollection = {
    successFuncModal: {
      title: "Creating Staking Pack",
      visibility: true,
      content: () => <SuccessModalContent />,
    },
    failedFuncModal: {
      title: "Creating Staking Pack",
      visibility: true,
      content: () => <FailedModalContent />,
    },
  };

  const modal = new ModalManager(setModalModel, modalTemplateCollection);

  return stakingStat ? (
    <PageButtonsWrapper>
      <div className="mx-auto h-auto w-full rounded-xl border border-gray-shade-3 bg-black-shade-9 px-10 pb-8 pt-10">
        <Details data={stakingPool} />
        <div className="flex h-fit flex-col gap-8 py-8 flg:flex-row">
          {stakingStat && (
            <StakeNow
              data={stakingStat}
              onValueChanged={stakingValueChanges}
              onSubmit={stakeSubmit}
              coins={coinsDetails}
            />
          )}
          <div className="h-auto w-full max-w-[512px] rounded-2xl border border-gray-shade-3 p-8">
            <p className="textGradient text-xl font-semibold">
              Reward Calculation
            </p>
            <div className="mt-11 flex items-center justify-between gap-5">
              <p className="flex items-center gap-2 text-sm text-gray-shade-14">
                <span>APY (%)</span>
                <AiOutlineInfoCircle className="h-4 w-4" />
              </p>
              <p className="text-sm font-medium text-white">
                {stakingPool?.apy} %
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between gap-5">
              <p className="flex items-center gap-2 text-sm text-gray-shade-14">
                <span>Total staked</span>
              </p>
              <p className="text-sm font-medium text-white">
                {formatUnits(
                  stakingPool?.totalStakedAmount + "",
                  coinsDetails.find((e) =>
                    eqAddress(e?.contractAddress, stakingPool?.token_address)
                  )?.decimals
                )}{" "}
                {
                  coinsDetails.find((e) =>
                    eqAddress(e?.contractAddress, stakingPool?.token_address)
                  )?.symbol
                }
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between gap-5">
              <p className="flex items-center gap-2 text-sm text-gray-shade-14">
                <span>Total paid rewards</span>
              </p>
              <p className="text-sm font-medium text-white">
                {formatUnits(
                  stakingPool?.totalPaidReward + "",
                  coinsDetails.find((e) =>
                    eqAddress(
                      e?.contractAddress,
                      stakingPool?.reward_token_address
                    )
                  )?.decimals
                )}{" "}
                {
                  coinsDetails.find((e) =>
                    eqAddress(
                      e?.contractAddress,
                      stakingPool?.reward_token_address
                    )
                  )?.symbol
                }
              </p>
            </div>
            <div className="mb-6 mt-6 flex items-center justify-between gap-5">
              <p className="flex items-center gap-2 text-sm text-gray-shade-14">
                <span>Stakers</span>
              </p>
              <p className="text-sm font-medium text-white">
                {stakingPool?.users ? stakingPool?.users.length : 0}
              </p>
            </div>
            <hr />
            <div className="mt-6 flex items-center justify-between gap-5">
              <p className="flex items-center gap-2 text-sm text-gray-shade-14">
                <span>Your reward in each claim</span>
              </p>
              <p className="text-sm font-medium text-white">
                {rewardEstimation ? (
                  normalizeValue(rewardEstimation.claim) +
                  " " +
                  coinsDetails.find((e) =>
                    eqAddress(
                      e?.contractAddress,
                      stakingPool?.reward_token_address
                    )
                  )?.symbol
                ) : (
                  <span className="textGradient text-sm">N/A</span>
                )}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between gap-5">
              <p className="flex items-center gap-2 text-sm text-gray-shade-14">
                <span>Your total reward</span>
              </p>
              <p className="text-sm font-medium text-white">
                {rewardEstimation ? (
                  normalizeValue(rewardEstimation.total) +
                  " " +
                  coinsDetails.find((e) =>
                    eqAddress(
                      e?.contractAddress,
                      stakingPool?.reward_token_address
                    )
                  )?.symbol
                ) : (
                  <span className="textGradient text-sm">N/A</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
        <Link href={`/staking/staking-details/${poolId}`}>
          <FinalButton
            title="My Staking overview"
            variant={activeTab == "index" ? "primary" : "secondary"}
            className="rounded-[10px]"
          />
        </Link>
        <Link href={`/staking/staking-details/${poolId}/rewards`}>
          <FinalButton
            title="Claim Rewards"
            variant={activeTab == "rewards" ? "primary" : "secondary"}
            className="rounded-[10px]"
          />
        </Link>
        <Link href={`/staking/staking-details/${poolId}/referrals`}>
          <FinalButton
            title="Referrals"
            variant={activeTab == "referrals" ? "primary" : "secondary"}
            className="rounded-[10px]"
          />
        </Link>
      </div>
      {children}
      {isLoading && <PreLoader />}
      {ModalModel.visibility && (
        <CustomModal
          title={ModalModel.title as string}
          onClose={() => {
            modal.dismissModal();
          }}
        >
          {ModalModel.content}
        </CustomModal>
      )}
    </PageButtonsWrapper>
  ) : null;
};

export default StakingDetailsWrapper;
