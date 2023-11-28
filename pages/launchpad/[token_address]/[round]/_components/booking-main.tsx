import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import useUser from "@/hooks/use.user";
import { RoundInfo } from "@/web3/constants/types";
import { BookingList } from "../../../_components/presale-components/booking-list";
import { RewardsList } from "../../../_components/presale-components/rewards-list";
import {
  PurchaseHistory,
  RewardBlockchain,
  getPurchaseWithBusd,
  getPurchaseWithBusdByUser,
  getPurchaseWithNtr,
  getPurchaseWithNtrByUser,
  getRefRewards,
} from "./";
import { TimelinePeriod } from "./timeline-period";

interface Props {
  loadingState: boolean;
  roundInfo: RoundInfo;
  signer: any;
  contributionInfo: any;
  refreshContributionInfo: any;
  setRoundNo: (roundNo: number) => void;
  setConnectWalletModal: (value: boolean) => void;
  connectedAddress: string | undefined | null;
  roundNo: number;
}

const BookingMain: React.FC<Props> = ({
  roundInfo,
  signer,
  contributionInfo,
  refreshContributionInfo,
  setRoundNo,
  loadingState,
  setConnectWalletModal,
  connectedAddress,
  roundNo,
}) => {
  const { user } = useUser();
  const [purchaseBusdData, setPurchaseBusdData] = useState<PurchaseHistory[]>(
    []
  );
  const [purchaseNtrData, setPurchaseNtrData] = useState<PurchaseHistory[]>([]);
  const [myBusdBookings, setMyBusdBookings] = useState<PurchaseHistory[]>([]);
  const [myNtrBookings, setMyNtrBookings] = useState<PurchaseHistory[]>([]);
  const [myBookings, setMyBookings] = useState<PurchaseHistory[]>([]);
  const [allPurchases, setAllPurchases] = useState<PurchaseHistory[]>([]);
  const [rewards, setRewards] = useState<RewardBlockchain[]>([]);
  const [bookingsTab, setBookingsTab] = useState<
    "recent-bookings" | "my-bookings" | "my-rewards"
  >("my-bookings");

  const GetPurchaseWithBusd = useCallback(() => {
    getPurchaseWithBusd().then((items) => {
      setPurchaseBusdData(items);
    });
  }, []);

  const GetPurchaseWithNtr = useCallback(() => {
    getPurchaseWithNtr().then((items) => {
      setPurchaseNtrData(items);
    });
  }, []);

  const GetPurchaseWithBusdByUser = useCallback(() => {
    if (!user?._id) return;
    getPurchaseWithBusdByUser(user?._id).then((items) => {
      setMyBusdBookings(items);
    });
  }, [user?._id]);

  const GetPurchaseWithNtrByUser = useCallback(() => {
    if (!user?._id) return;
    getPurchaseWithNtrByUser(String(user?._id)).then((items) => {
      setMyNtrBookings(items);
    });
  }, [user?._id]);

  const GetRefRewards = useCallback(() => {
    getRefRewards(String(user?._id)).then((items) => {
      items.sort((a, b) => {
        return (
          new Date(b.createdAt * 1000).getTime() -
          new Date(a.createdAt * 1000).getTime()
        );
      });
      setRewards(items);
    });
  }, [user?._id]);

  useEffect(() => {
    GetPurchaseWithBusd();
    GetPurchaseWithNtr();
    GetPurchaseWithBusdByUser();
    GetPurchaseWithNtrByUser();
    GetRefRewards();
  }, [
    GetPurchaseWithBusd,
    GetPurchaseWithNtr,
    GetPurchaseWithBusdByUser,
    GetPurchaseWithNtrByUser,
    GetRefRewards,
  ]);

  useEffect(() => {
    const allPurchases = [...purchaseBusdData, ...purchaseNtrData];
    const allPurchasesSorted = allPurchases
      .sort((a, b) => {
        return (
          new Date(b.createdAt * 1000).getTime() -
          new Date(a.createdAt * 1000).getTime()
        );
      })
      .slice(0, 20);
    const myBookings = [...myBusdBookings, ...myNtrBookings];
    myBookings.sort((a, b) => {
      return (
        new Date(b.createdAt * 1000).getTime() -
        new Date(a.createdAt * 1000).getTime()
      );
    });
    setAllPurchases(allPurchasesSorted);
    setMyBookings(myBookings);
    setRewards(rewards);
  }, [
    purchaseBusdData,
    purchaseNtrData,
    myBusdBookings,
    myNtrBookings,
    rewards,
  ]);

  if (!purchaseBusdData && !purchaseNtrData) return null;
  if (!allPurchases) return null;
  if (!myBookings) return null;
  if (!rewards) return null;

  if (!connectedAddress) setConnectWalletModal(true);

  return (
    <div>
      <div className="h-auto w-full overflow-hidden rounded-[14px] border border-gray-shade-3 bg-black-shade-3">
        <div className="flex items-center gap-6 overflow-x-auto rounded-t-[14px] bg-elevation-1 px-4 py-6 font-semibold text-white fsm:gap-8 fsm:px-8">
          <button
            onClick={() => setBookingsTab("my-bookings")}
            className={clsx(
              `whitespace-nowrap text-sm fsm:text-base`,
              bookingsTab === "my-bookings" && "text-gradient"
            )}
          >
            My Bookings
          </button>
          <button
            onClick={() => setBookingsTab("recent-bookings")}
            className={clsx(
              `whitespace-nowrap text-sm fsm:text-base`,
              bookingsTab === "recent-bookings" && "text-gradient"
            )}
          >
            Recent Bookings
          </button>
          <button
            onClick={() => setBookingsTab("my-rewards")}
            className={clsx(
              `whitespace-nowrap text-sm fsm:text-base`,
              bookingsTab === "my-rewards" && "text-gradient"
            )}
          >
            My Rewards
          </button>
        </div>

        <hr className="border border-gray-shade-3" />

        {(bookingsTab === "recent-bookings" ||
          bookingsTab === "my-bookings") && (
          <BookingList
            setRoundNo={setRoundNo}
            recievableTokenSymbol="DXC"
            bookingsTab={bookingsTab}
            bookings={
              bookingsTab === "recent-bookings"
                ? allPurchases
                : bookingsTab === "my-bookings"
                ? myBookings
                : []
            }
          />
        )}

        {bookingsTab === "my-rewards" && (
          <RewardsList rewards={rewards ?? []} />
        )}
      </div>
      {roundNo !== -1 &&
      bookingsTab === "my-bookings" &&
      contributionInfo &&
      !loadingState ? (
        <div className="mt-6">
          <h2 className="textGradient text-xl font-semibold">
            Round: {roundNo + 1} Rewards
          </h2>
          <TimelinePeriod
            isBUSD={contributionInfo.contributedBusdAmount > 0}
            roundInfo={roundInfo}
            signer={signer}
            contributionInfo={contributionInfo}
            refetchContributionInfo={refreshContributionInfo}
          />
        </div>
      ) : (
        roundNo !== -1 &&
        loadingState && (
          <div className="mt-10 flex w-full items-center justify-center">
            <Image
              src="/images/preloader.png"
              alt="Preloader"
              width={64}
              height={64}
              className="h-16 w-16 flex-shrink-0 object-cover"
            />
          </div>
        )
      )}
    </div>
  );
};

export default BookingMain;
