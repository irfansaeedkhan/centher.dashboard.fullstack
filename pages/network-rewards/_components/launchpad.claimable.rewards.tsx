import clsx from "clsx";
import React, { useEffect, useState } from "react";
import ctl from "@netlify/classnames-template-literals";
import { useGetClaimableNtrForReferral } from "@/web3/hooks/use.get.claimable.ntr.for.referral";
import { useGetClaimableBusdForReferral } from "@/web3/hooks/use.get.claimable.busd.for.referral";
import { useNetworkRewards } from "@/store/network.rewards";
import useUser from "@/hooks/use.user";
import SingleLevelReward from "./single.level.reward";
import { ReferralClaimItem, RewardsEachAsset } from "@/models/referral";
import { formatAddress } from "@/utils/format.address";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { useNTRPrice } from "@/hooks/use.get.ntr.price.ts";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-hot-toast";
import { ModalState, StandardModal } from "@/components/modal/standard.modal";
import { RoundState, RoundStatus } from "@/web3/constants/types";
import { getRoundState } from "@/web3/hooks/use.contracts.functions";
import { BlockchainWrite } from "@/web3/blockchain";

export interface ClaimableRewardsProps {
  rewardState: "launchpad-rewards" | "marketplace-rewards";
}

const LaunchpadClaimableRewards: React.FC<ClaimableRewardsProps> = ({
  rewardState,
}) => {
  const { library, account } = useWeb3React();
  const { user: loggedInUser } = useUser();
  const {
    rewardsInLaunchpad,
    claimsInLaunchpad,
    rewardsInMarketplace,
    rewardsEachLevel,
    rewardsTotal,
    fetchReferralRewardsInLaunchpad,
    fetchReferralClaimsInLaunchpad,
  } = useNetworkRewards((state) => ({
    rewardsInLaunchpad: state.rewardsInLaunchpad,
    claimsInLaunchpad: state.claimsInLaunchpad,
    rewardsInMarketplace: state.rewardsInMarketplace,
    rewardsEachLevel: state.rewardsEachLevel,
    rewardsTotal: state.rewardsTotal,
    fetchReferralRewardsInLaunchpad: state.fetchReferralRewardsInLaunchpad,
    fetchReferralClaimsInLaunchpad: state.fetchReferralClaimsInLaunchpad,
  }));

  const bnbPrice = useBNBPrice();
  const ntrPrice = useNTRPrice();
  const [reload, setReload] = useState(false);
  const claimableBusd = useGetClaimableBusdForReferral(
    loggedInUser?._id,
    reload
  );
  const claimableNtr = useGetClaimableNtrForReferral(loggedInUser?._id, reload);

  useEffect(() => {
    if (loggedInUser?._id) {
      fetchReferralClaimsInLaunchpad(loggedInUser?._id);
      fetchReferralRewardsInLaunchpad(loggedInUser?._id);
    }
  }, [
    fetchReferralClaimsInLaunchpad,
    fetchReferralRewardsInLaunchpad,
    loggedInUser?._id,
  ]);

  const [roundState, setRoundState] = useState<RoundState>(
    RoundState.RoundsNotStarted
  );
  useEffect(() => {
    const fetchRoundState = async () => {
      const _roundState = await getRoundState();
      setRoundState(_roundState);
    };
    fetchRoundState();
  }, []);

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    status: "warning",
    title: "Claim NTR",
    subtitle: `Do you want to claim NTR?`,
    bodyText: `Claim to receive NTR.`,
    confirmButtonText: "Claim NTR",
    onClose: () => {
      setModal((prev) => ({
        ...prev,
        isOpen: false,
      }));
    },
    onClickConfirm: () => {},
  });

  const openClaimNTRModal = () => {
    if (claimableNtr <= 0) {
      toast.error(`You have no claimable NTR.`);
      return;
    }

    setModal((prev) => ({
      ...prev,
      isOpen: true,
      status: "claim-ntr",
      title: "Claim NTR",
      subtitle: `Do you want to claim NTR?`,
      bodyText: `You will receive ${claimableNtr} NTR.`,
      confirmButtonText: "Claim NTR",
      onClickConfirm: handleClaimNTR,
    }));
  };

  const openClaimBNBModal = () => {};

  const handleClaimNTR = async () => {
    try {
      if (!account || !library) return;

      setModal((prev) => ({
        ...prev,
        status: "progress",
      }));

      const result = await BlockchainWrite.callClaimNTRForReferral(library);

      if (result?.length) {
        setModal((prev) => ({
          ...prev,
          subtitle: "Claim Successful",
          bodyText: `You should receive ${claimableNtr} NTR in your wallet.`,
          status: "success",
        }));
        setReload(!reload);
      } else {
        toast.error("Claim Transaction Failed");
        setModal((prev) => ({
          ...prev,
          status: "error",
          confirmButtonText: "Try Again",
        }));
      }
    } catch (error) {
      toast.error("Claim Transaction Failed");
      setModal((prev) => ({
        ...prev,
        status: "error",
        confirmButtonText: "Try Again",
      }));
    }
  };

  const openClaimBUSDModal = () => {
    if (claimableBusd <= 0) {
      toast.error(`You have no claimable BUSD.`);
      return;
    }

    setModal((prev) => ({
      ...prev,
      isOpen: true,
      status: "claim-busd",
      title: "Claim BUSD",
      subtitle: `Do you want to claim BUSD?`,
      bodyText: `You will receive ${claimableBusd} BUSD.`,
      confirmButtonText: "Claim BUSD",
      onClickConfirm: handleClaimBUSD,
    }));
  };

  const handleClaimBUSD = async () => {
    try {
      if (!account || !library) return;

      setModal((prev) => ({
        ...prev,
        status: "progress",
      }));

      const result = await BlockchainWrite.callClaimBUSDForReferral(library);

      if (result?.length) {
        setModal((prev) => ({
          ...prev,
          subtitle: "Claim Successful",
          bodyText: `You should receive ${claimableBusd} BUSD in your wallet.`,
          status: "success",
        }));
        setReload(!reload);
      } else {
        toast.error("Claim Transaction Failed");
        setModal((prev) => ({
          ...prev,
          status: "error",
          confirmButtonText: "Try Again",
        }));
      }
    } catch (error) {
      toast.error("Claim Transaction Failed");
      setModal((prev) => ({
        ...prev,
        status: "error",
        confirmButtonText: "Try Again",
      }));
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="h-auto w-full rounded-[14px] bg-elevation-1">
        <div
          className={clsx(
            `flex h-auto w-full  flex-col justify-between gap-4 rounded-t-[14px] bg-cover bg-center bg-no-repeat py-5 pl-3 pr-3 fsm:h-[92px] fsm:flex-row fsm:items-center fsm:pl-7 fsm:pr-4`,
            rewardState === "marketplace-rewards"
              ? "bg-[url(/images/liscense1.png)]"
              : "bg-[url(/images/liscense3.png)]"
          )}
        >
          <div className="space-y-1 text-xs text-white fsm:text-sm">
            <p className="">Total Rewards</p>
            {rewardState === "launchpad-rewards" ? (
              <span className="flex items-center gap-2 font-semibold">
                <p>{`${rewardsTotal.busd} BUSD`}</p>
                {/* <span className="h-3 border-l border-white/[0.1]" />
                <p>{`${rewardsTotal.ntr} (NTR)`}</p> */}
              </span>
            ) : rewardState === "marketplace-rewards" ? (
              <p className="flex items-center gap-2 font-semibold">00 (BNB)</p>
            ) : null}
          </div>

          <div className="space-y-1 text-xs text-white fsm:text-sm">
            <p className="">Claimable Rewards</p>
            {rewardState === "launchpad-rewards" ? (
              <span className="flex items-center gap-2 font-semibold">
                <p>{`${claimableBusd} BUSD`}</p>
                {/* <span className="h-3 border-l border-white/[0.1]" />
                <p>{`${claimableNtr} (NTR)`}</p> */}
              </span>
            ) : rewardState === "marketplace-rewards" ? (
              <p className="flex items-center gap-2 font-semibold">00 (BNB)</p>
            ) : null}
          </div>

          {rewardState === "launchpad-rewards" && (
            <button
              disabled={claimableBusd === 0}
              onClick={
                !account
                  ? () => {
                      toast.error("Please connect your wallet");
                    }
                  : openClaimBUSDModal
              }
              className={clsx(
                `h-10 w-full rounded-xl text-center text-sm font-bold fsm:w-[172px]`,
                claimableBusd === 0 &&
                  `bg-background-shade-2 text-gray-shade-7`,
                !(claimableBusd === 0) && `bg-brand-primary text-black-shade-3`
              )}
            >
              Claim BUSD
            </button>
          )}
          {/* {rewardState === "launchpad-rewards" && (
            <button
              disabled={claimableNtr === 0}
              onClick={
                !account
                  ? () => {
                      toast.error("Please connect your wallet");
                    }
                  : openClaimNTRModal
              }
              className={clsx(
                `h-10 w-full rounded-xl text-center text-sm font-bold fsm:w-[172px]`,
                claimableNtr === 0 && `bg-background-shade-2 text-gray-shade-7`,
                !(claimableNtr === 0) && `bg-brand-primary text-black-shade-3`
              )}
            >
              Claim NTR
            </button>
          )} */}
          {rewardState === "marketplace-rewards" && (
            <button
              disabled={true}
              onClick={
                !account
                  ? () => {
                      toast.error("Please connect your wallet");
                    }
                  : openClaimBNBModal
              }
              className={clsx(
                `h-10 w-full rounded-xl bg-background-shade-2 text-center text-sm font-bold text-gray-shade-7 fsm:w-[172px]`
              )}
            >
              Claim BNB
            </button>
          )}
          <StandardModal
            isOpen={modal.isOpen}
            status={modal.status}
            title={modal.title}
            subtitle={modal.subtitle}
            bodyText={modal.bodyText}
            onClickClose={modal.onClose}
            confirmButtonText={modal.confirmButtonText}
            onClickConfirm={modal.onClickConfirm}
          />
        </div>
        <div className="flex flex-wrap gap-10 py-6 pl-6 md:pl-10">
          {rewardsEachLevel &&
            rewardsEachLevel.map((rewards: RewardsEachAsset, index: number) => {
              return (
                <SingleLevelReward
                  rewardState={rewardState}
                  rewards={rewards}
                  level={index + 1}
                  bnbPrice={bnbPrice}
                  ntrPrice={ntrPrice}
                  key={index}
                />
              );
            })}
        </div>
      </div>
      {/* table */}
      <div>
        {rewardState === "launchpad-rewards" && (
          <div className={TableContainer}>
            <h3 className={TableTitle}>LAUNCHPAD REWARDS</h3>
            <table className={table}>
              <thead className={thead}>
                <tr>
                  <th scope="col" className={th}>
                    Date
                  </th>
                  <th scope="col" className={th}>
                    Public Key (Rewards from)
                  </th>
                  <th scope="col" className={th}>
                    Round
                  </th>
                  <th scope="col" className={th}>
                    level
                  </th>
                  <th scope="col" className={th}>
                    My Rewards
                  </th>
                  <th scope="col" className={th}>
                    State
                  </th>
                </tr>
              </thead>
              <tbody>
                {rewardsInLaunchpad &&
                  rewardsInLaunchpad.map((item: any, index: number) => {
                    const date = new Date(item.createdAt * 1000);
                    const claims: ReferralClaimItem[] = item.isBusd
                      ? claimsInLaunchpad.busd
                      : claimsInLaunchpad.ntr;
                    let state;
                    // if (roundState !== RoundState.RoundsEnded) {
                    //   state = "Locked";
                    // } else {
                    //   if (claims.length > 0) {
                    //     state =
                    //       item.createdAt > claims[0].createdAt
                    //         ? "Claimable"
                    //         : "Claimed";
                    //   } else {
                    //     state = "Claimable";
                    //   }
                    // }
                    if (claims.length > 0) {
                      state =
                        item.createdAt > claims[0].createdAt
                          ? "Claimable"
                          : "Claimed";
                    } else {
                      state = "Claimable";
                    }
                    return (
                      <tr className={tbodyTR} key={index}>
                        <td
                          className={td}
                        >{`${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`}</td>
                        <td className={td}>{formatAddress(item.user)}</td>
                        <td className={td}>{`Round ${item.round + 1}`}</td>
                        <td className={td}>{item.level}</td>
                        <td className={td}>
                          {item.isBusd
                            ? `${item.amount} BUSD`
                            : `${item.amount} NTR`}
                        </td>
                        <td className={td}>{state}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
        {rewardState === "marketplace-rewards" && (
          <div className={TableContainer}>
            <h3 className={TableTitle}>NFT REWARDS</h3>
            <table className={table}>
              <thead className={thead}>
                <tr>
                  <th scope="col" className={th}>
                    Date
                  </th>
                  <th scope="col" className={th}>
                    Public Key (Rewards from)
                  </th>
                  <th scope="col" className={th}>
                    level
                  </th>
                  <th scope="col" className={th}>
                    Days
                  </th>
                  <th scope="col" className={th}>
                    My Rewards
                  </th>
                  <th scope="col" className={th}>
                    Claim Rewards
                  </th>
                </tr>
              </thead>
              <tbody>
                {rewardsInMarketplace &&
                  rewardsInMarketplace.map((item: any, index: number) => {
                    const date = new Date(item.createdAt * 1000);
                    return (
                      <tr className={tbodyTR} key={index}>
                        <td
                          className={td}
                        >{`${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`}</td>
                        <td className={td}>{formatAddress(item.user)}</td>
                        <td className={td}>{`Round ${item.round}`}</td>
                        <td className={td}>{item.level}</td>
                        <td className={td}>
                          {item.isBusd
                            ? `${item.amount} BUSD`
                            : `${item.amount} NTR`}
                        </td>
                        <td className={td}>00</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaunchpadClaimableRewards;

const TableTitle = ctl(` 
p-5  lg:p-8 lg:pb-5 text-20px font-semibold text-white
`);
const TableContainer = ctl(` 
overflow-x-auto relative bg-background-shade-3 shadow-md rounded-2xl mt-8 lg:mt-12
`);
const table = ctl(` 
overflow-hidden w-full border-2 rounded-2xl border-gray-shade-3 text-sm text-left text-gray-500 bg-background-shade-3 
`);
const thead = ctl(` 
text-14px text-gray-shade-7  uppercase bg-background-shade-3 
`);
const th = ctl(` 
py-4 lg:py-7 first:px-8 last:px-8 px-5 lg:px-6 capitalize
`);
const td = ctl(` 
first:px-8 last:px-8 px-5 lg:px-6 text-14px py-4 lg:py-7  text-white font-medium
`);
const tbodyTR = ctl(` 
border-b border-gray-shade-3  odd:bg-black-shade-3 even:bg-black-shade-11
`);
