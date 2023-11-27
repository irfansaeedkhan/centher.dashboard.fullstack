import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { AiOutlineInfoCircle } from "react-icons/ai";
import axios from "axios";
import { formatUnits, parseEther } from "ethers/lib/utils";
import Button from "@/components/button";
import { useStaking } from "@/hooks/staking";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { setupUiModels } from "@/staking/helpers/mappers.helper";
import { ZeroAddress } from "@/web3/constants/common";
import { formatIPFSUrl } from "@/utils/format.address";
import { ListCardDataOBj } from "@/pages/staking/_components/list-card-data";
import { PreLoader } from "@/components/pre.loader";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { useWallet } from "@/web3/hooks/use.wallet";
import { fetchTokenMetadata } from "@/hooks/use.token.metadata";
import { eqAddress } from "@/live/utils/address.utils";
import { CustomModal } from "@/components/modal/custom.modal";
import { IModalHandler, ModalManager, TemplateCollection } from "@/utils/modal";
import StakeNow, { StakingStat } from "./stake-now";
import Details from "./details";
import PageButtonsWrapper from "./page-buttons";
import SuccessModalContent from "./success-modal-content";
import FailedModalContent from "./failed-modal-content";
import { SwapTokens } from "./swap";
import { SwappingProjects } from "@/staking/config";

const oneYearInSec = 31449600;

interface Props {
  children?: React.ReactNode;
}

enum ModalType {
  successFuncModal = "successFuncModal",
  failedFuncModal = "failedFuncModal",
}

const StakingDetailsWrapper = ({ children }: Props) => {
  const router = useRouter();
  const { getSigner, connectedAddress } = useWallet();
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });
  const { sdk } = useStaking();
  const [poolId, setPoolId] = useState("0");
  const [activeTab, setActiveTab] = useState("index");
  const [stakingStat, setStakingStat] = useState<StakingStat | null>(null);
  const [coinsDetails, setCoinsDetails] = useState<
    Array<CoinDetails | undefined>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSwapping, setHasSwapping] = useState(false);
  const [stakingPool, setStakingPool] = useState<ListCardDataOBj | null>(null);
  const [rewardEstimation, setRewardEstimation] = useState<{
    claim: string;
    total: string;
  } | null>(null);
  const [stakingValue, setStakingValue] = useState<string>("0");
  const [stakeLoader, setStakeLoader] = useState<boolean>(false);

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
        minAmount: stakingPool.min_staking_amount,
        maxAmount: stakingPool.max_staking_amount,
      });
    }
  }, [stakingPool, stakingStat]);

  useEffect(() => {
    const getCoinDetails = async (tokens: string[]) => {
      const list: string[] = [];
      tokens.filter(Boolean).forEach((e) => {
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
        +(+stakingPool.apy / 10000).toFixed(2) *
        +stakingValue *
        +(+stakingPool.staking_period / oneYearInSec).toFixed(4);

      const claim =
        +(+stakingPool.apy / 10000).toFixed(2) *
        +stakingValue *
        +(+stakingPool.claim_period / oneYearInSec).toFixed(4);

      let coef = 1;
      if (stakingPool.rate && stakingPool.rate > 0) {
        coef = stakingPool.rate;
      }

      setRewardEstimation({
        total: total * coef + "",
        claim: claim * coef + "",
      });
    }
  }, [stakingValue, stakingPool]);

  useEffect(() => {
    if (stakingPool) {
      setHasSwapping(SwappingProjects.includes(stakingPool.id));
    }
  }, [stakingPool]);

  const stakingValueChanges = (value: string) => {
    setStakingValue(value);
  };

  const stakeSubmit = async (referrer: string) => {
    try {
      if (!getSigner() || !connectedAddress?.length) {
        throw new Error("Connect wallet");
      }

      const amount = parseEther(normalizeValue(stakingValue) + "").toString();
      const minAmount = stakingPool?.min_staking_amount || "0";
      const maxAmount = stakingPool?.max_staking_amount || "0";
      if (sdk && poolId) {
        if (
          stakingPool?.max_staking_amount &&
          +stakingPool?.max_staking_amount > 0 &&
          +stakingPool?.max_staking_amount < +amount
        ) {
          modal.createModal(ModalType.failedFuncModal, {
            message: `Amount must be less than ${formatUnits(
              maxAmount
            ).toString()}.`,
            title: "Invalid Amount",
          });
          return;
        }

        if (+amount < +minAmount) {
          modal.createModal(ModalType.failedFuncModal, {
            message: `Amount must be bigger than ${formatUnits(
              minAmount
            ).toString()}.`,
            title: "Invalid Amount",
          });
          return;
        }

        if (+minAmount > 0) {
          const div = ethers.FixedNumber.from(amount)
            .divUnsafe(ethers.FixedNumber.from(minAmount))
            .toString()
            .split(".")[1];
          if (div && +div > 0) {
            modal.createModal(ModalType.failedFuncModal, {
              message: `Amount must be a coefficient of ${formatUnits(
                minAmount
              ).toString()}, eg. ${formatUnits(minAmount).toString()}, ${
                +formatUnits(minAmount).toString() * 2
              }, ${+formatUnits(minAmount).toString() * 3}, ...`,
              title: "Invalid Amount",
            });
            return;
          }
        }

        setStakeLoader(true);
        await sdk.stake(
          getSigner()!,
          +poolId,
          connectedAddress,
          amount,
          stakingPool?.token_address as string
        );
        setStakeLoader(false);
        modal.createModal(ModalType.successFuncModal, {
          title: "New Stake",
          message:
            "Your stake processed successfully. Reload the page to get the latest details.",
        });
      } else {
        throw new Error("Invalid params");
      }
    } catch (error) {
      let message = error instanceof Error ? error.message : error;

      if (
        typeof message == "string" &&
        message.includes("call revert exception")
      ) {
        message =
          "This request cannot be done at this moment, please try after a while or contact support.";
      }

      if (
        typeof message == "string" &&
        message.includes("rejected transaction")
      ) {
        message = "Transaction rejected.";
      }

      setStakeLoader(false);
      modal.createModal(ModalType.failedFuncModal, {
        message,
        title: "New Stake Failed",
      });
    }
  };

  const modalTemplateCollection: TemplateCollection = {
    successFuncModal: {
      title: "Creating Staking Pack",
      visibility: true,
      content: (input: { title: string; message: string }) => (
        <SuccessModalContent message={input.message} title={input.title} />
      ),
    },
    failedFuncModal: {
      title: "Creating Staking Pack",
      visibility: true,
      content: (input: { title: string; message: string }) => (
        <FailedModalContent message={input.message} title={input.title} />
      ),
    },
  };

  const modal = new ModalManager(setModalModel, modalTemplateCollection);

  return stakingStat ? (
    <PageButtonsWrapper stakingPool={stakingPool}>
      {!router.pathname.includes("rewards") &&
        !router.pathname.includes("referrals") && (
          <div className="mx-auto h-auto w-full rounded-xl border border-gray-shade-3 bg-black-shade-9 p-4 fxm:p-6">
            {router.pathname.includes("project-details") && (
              <Details data={stakingPool} />
            )}
            {!router.pathname.includes("project-details") && (
              <div className="flex h-fit flex-col justify-between gap-8 flg:flex-row">
                {stakingStat && (
                  <StakeNow
                    data={stakingStat}
                    onValueChanged={stakingValueChanges}
                    onSubmit={stakeSubmit}
                    coins={coinsDetails}
                    start={stakingPool?.start_time || "1"}
                    stakingLoader={stakeLoader}
                  />
                )}
                <div className="h-auto w-full rounded-2xl border border-gray-shade-3 p-8 flg:max-w-[512px]">
                  <p className="text-[min(10vw, 20px)] font-semibold text-white">
                    Reward Calculation
                  </p>
                  <div className="mt-11 flex items-center justify-between gap-5">
                    <p className="flex items-center gap-2 text-sm text-gray-shade-14">
                      <span>APY (%)</span>
                      <AiOutlineInfoCircle className="h-4 w-4" />
                    </p>
                    <p className="text-sm font-medium text-white">
                      {(stakingPool ? +stakingPool.apy : 0) / 100} %
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-5">
                    <p className="flex items-center gap-2 text-sm text-gray-shade-14">
                      <span>Total staked</span>
                    </p>
                    <p className="text-sm font-medium text-white">
                      {Number(
                        formatUnits(
                          stakingPool?.totalStakedAmount + "",
                          coinsDetails.find((e) =>
                            eqAddress(
                              e?.contractAddress,
                              stakingPool?.token_address
                            )
                          )?.decimals || 18
                        )
                      )?.toFixed(2)}{" "}
                      {
                        coinsDetails.find((e) =>
                          eqAddress(
                            e?.contractAddress,
                            stakingPool?.token_address
                          )
                        )?.symbol
                      }
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-5">
                    <p className="flex items-center gap-2 text-sm text-gray-shade-14">
                      <span>Total paid rewards</span>
                    </p>
                    <p className="text-sm font-medium text-white">
                      {Number(
                        formatUnits(
                          stakingPool?.totalPaidReward + "",
                          coinsDetails.find((e) =>
                            eqAddress(
                              e?.contractAddress,
                              stakingPool?.reward_token_address
                            )
                          )?.decimals || 18
                        )
                      )?.toFixed(2)}{" "}
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
                  <div className="border-b-2 border-gray-shade-3"></div>
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
                        Number(normalizeValue(rewardEstimation.total))?.toFixed(
                          2
                        ) +
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
            )}
          </div>
        )}
      {hasSwapping ? <SwapTokens /> : null}

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
