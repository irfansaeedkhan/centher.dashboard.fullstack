import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BigNumber, ethers } from "ethers";
import { formatEther, formatUnits, parseEther } from "ethers/lib/utils";
import { useStaking } from "@/hooks/staking";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { ListCardDataOBj } from "@/pages/staking/_components/list-card-data";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { useWallet } from "@/web3/hooks/use.wallet";
import { CustomModal } from "@/components/modal/custom.modal";
import { IModalHandler, ModalManager, TemplateCollection } from "@/utils/modal";
import StakeNow, { StakingStat } from "./stake-now";
import SuccessModalContent from "./success-modal-content";
import FailedModalContent from "./failed-modal-content";
import { eqAddress } from "@/lib/chat/utils";
import { BlockchainRead } from "@/web3/blockchain";

const oneYearInSec = 31449600;

enum ModalType {
  successFuncModal = "successFuncModal",
  failedFuncModal = "failedFuncModal",
}

const StakingDetailsTop: React.FC<{
  setConnectWalletModal: (value: boolean) => void;
  stakingPool: ListCardDataOBj;
  coinsDetails: CoinDetails[];
  reload: any;
}> = ({ setConnectWalletModal, stakingPool, coinsDetails, reload }) => {
  const router = useRouter();
  const { getSigner, connectedAddress } = useWallet();
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });
  const { sdk } = useStaking();
  const [activeTab, setActiveTab] = useState("index");
  const [stakingStat, setStakingStat] = useState<StakingStat | null>(null);
  const [rewardEstimation, setRewardEstimation] = useState<{
    claim: string;
    total: string;
  } | null>(null);
  const [stakingValue, setStakingValue] = useState(0);
  const [stakedAmount, setStakedAmount] = useState<string>("0");
  const [restakedAmount, setRestakedAmount] = useState<string>("0");
  const [stakeLoader, setStakeLoader] = useState<boolean>(false);
  const signer = getSigner();

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
    if (stakingPool && !stakingStat) {
      try {
        const totalStakedAmount =
          +stakingPool.totalStakedAmount + +stakingPool.totalRestakedAmount;

        setStakingStat({
          totalStakedAmount: totalStakedAmount + "",
          totalStakingCap: stakingPool.supply,
          tokenAddress: stakingPool.token_address,
          minAmount: stakingPool.min_staking_amount,
          maxAmount: stakingPool.max_staking_amount,
        });
      } catch (error) {}
    }

    if (stakingPool) {
      try {
        setStakedAmount(
          stakingPool.totalStakedAmount?.trim() == ""
            ? "0"
            : formatEther(stakingPool.totalStakedAmount)
        );
        setRestakedAmount(
          stakingPool.totalRestakedAmount?.trim() == ""
            ? "0"
            : formatEther(stakingPool.totalRestakedAmount)
        );
      } catch (error) {}
    }
  }, [stakingPool, stakingStat]);

  useEffect(() => {
    if (stakingPool) {
      const total =
        +(+stakingPool.apy / 10000) *
        +stakingValue *
        +(+stakingPool.staking_period / oneYearInSec);

      const claim =
        +(+stakingPool.apy / 10000) *
        +stakingValue *
        +(+stakingPool.claim_period / oneYearInSec);

      let coef = 1;
      if (stakingPool.rate && stakingPool.rate > 0) {
        coef = stakingPool.rate;
      }

      setRewardEstimation({
        total: +total.toFixed(2) * coef + "",
        claim: +claim.toFixed(2) * coef + "",
      });
    }
  }, [stakingValue, stakingPool]);

  const stakingValueChanges = (value: string) => {
    setStakingValue(+value);
  };

  const stakeSubmit = async (referrer: string) => {
    try {
      if (!signer || !connectedAddress?.length) {
        throw new Error("Connect wallet");
      }
      const amount = parseEther(normalizeValue(stakingValue) + "").toString();
      const minAmount = stakingPool?.min_staking_amount || "0";
      const maxAmount = stakingPool?.max_staking_amount || "0";
      if (sdk) {
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
        const userErc20Balance = await BlockchainRead.getERC20Balance(
          connectedAddress,
          stakingPool?.token_address,
          signer!
        );
        if (+stakingValue > Number(userErc20Balance)) {
          modal.createModal(ModalType.failedFuncModal, {
            message: "You don't have enough balance to stake.",
            title: "New Stake Failed",
          });
          return;
        }

        setStakeLoader(true);
        await sdk.stake(
          signer!,
          +stakingPool.id,
          connectedAddress,
          amount,
          stakingPool?.token_address as string
        );

        setStakeLoader(false);
        modal.createModal(ModalType.successFuncModal, {
          title: "New Stake",
          message: "Your stake processed successfully",
        });
        setStakingValue(0);
        setTimeout(async () => {
          await reload(true);
        }, 2500);
      } else {
        throw new Error("Invalid params");
      }
    } catch (error) {
      let message = error instanceof Error ? error.message : error;
      setStakingValue(0);
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

      if (
        typeof message == "string" &&
        message.includes("transfer amount exceeds balance")
      ) {
        message = "ERC20: transfer amount exceeds balance.";
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
      title: "Creating Staking Pack Successfully",
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

  return (
    stakingStat && (
      <div className="mx-auto h-auto w-full rounded-xl border border-gray-shade-3 bg-black-shade-9 p-4 fsm:p-6">
        <div className="flex h-fit flex-col justify-between gap-8 flg:flex-row">
          {stakingStat && (
            <StakeNow
              data={stakingStat}
              onValueChanged={stakingValueChanges}
              onSubmit={stakeSubmit}
              coins={coinsDetails}
              start={stakingPool?.start_time || "1"}
              stakingLoader={stakeLoader}
              connectedAddress={connectedAddress}
              walletModal={() => setConnectWalletModal(true)}
              signer={signer}
              amount={stakingValue}
            />
          )}
          <div className="h-auto w-full rounded-2xl border border-gray-shade-3 bg-transparent p-4 fsm:p-6 flg:max-w-[512px] flg:p-8">
            <div>
              <p className="text-[min(10vw, 20px)] font-semibold text-white">
                Staking Amount
              </p>
              <div className="mt-4 flex items-center justify-between gap-5">
                <p className="flex items-center gap-2 text-sm text-gray-shade-14">
                  <span>Token Staked</span>
                </p>
                <p className="text-sm font-medium text-white">
                  {normalizeValue(Number(stakedAmount)?.toFixed(3))}&nbsp;
                  {
                    coinsDetails.find((e) =>
                      eqAddress(e.contractAddress, stakingPool.token_address)
                    )?.symbol
                  }
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between gap-5">
                <p className="flex items-center gap-2 text-sm text-gray-shade-14">
                  <span>Token ReStaked</span>
                </p>
                <p className="text-sm font-medium text-white">
                  {normalizeValue(Number(restakedAmount)?.toFixed(3))}&nbsp;
                  {
                    coinsDetails.find((e) =>
                      eqAddress(e.contractAddress, stakingPool.token_address)
                    )?.symbol
                  }
                </p>
              </div>
            </div>
            <div className="mt-8">
              <p className="text-[min(10vw, 20px)] font-semibold text-white">
                Reward Calculation
              </p>
              <div className="mt-4 flex items-center justify-between gap-5">
                <p className="flex items-center gap-2 text-sm text-gray-shade-14">
                  <span>Your reward in each claim</span>
                </p>
                <p className="text-sm font-medium text-white">
                  {normalizeValue(Number(rewardEstimation?.claim)?.toFixed(3))}
                  &nbsp;
                  {
                    coinsDetails.find((e) =>
                      eqAddress(e.contractAddress, stakingPool.token_address)
                    )?.symbol
                  }
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between gap-5">
                <p className="flex items-center gap-2 text-sm text-gray-shade-14">
                  <span>Your total reward</span>
                </p>
                <p className="text-sm font-medium text-white">
                  {normalizeValue(Number(rewardEstimation?.total)?.toFixed(3))}
                  &nbsp;
                  {
                    coinsDetails.find((e) =>
                      eqAddress(e.contractAddress, stakingPool.token_address)
                    )?.symbol
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
        {ModalModel.visibility && (
          <CustomModal
            title={" "}
            onClose={() => {
              modal.dismissModal();
            }}
            heightClass={"fxm:h-auto"}
          >
            {ModalModel.content}
          </CustomModal>
        )}
      </div>
    )
  );
};

export default StakingDetailsTop;
