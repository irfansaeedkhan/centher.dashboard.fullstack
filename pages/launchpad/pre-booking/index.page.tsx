import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CgSpinner } from "react-icons/cg";
import clsx from "clsx";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { usePreBookingStats } from "@/hooks/use-pre-booking-stats";
import useUser from "@/hooks/use.user";
import { AppRoutes } from "@/constants/app.routes";

import BookingData from "../_components/presale-components/booking-data";
import { BookingList } from "../_components/presale-components/booking-list";
import { RewardsList } from "../_components/presale-components/rewards-list";

const PreSale: NextPageWithLayout = () => {
  const { user } = useUser();
  const { loading, preBookingStats } = usePreBookingStats(
    user?.account_address
  );
  const router = useRouter();
  const [bookingsTab, setBookingsTab] = useState<
    "recent-bookings" | "my-bookings" | "my-rewards"
  >("recent-bookings");

  useEffect(() => {
    if (router.query.tab === "my-bookings") {
      setBookingsTab("my-bookings");
    } else if (router.query.tab === "my-rewards") {
      setBookingsTab("my-rewards");
    } else {
      setBookingsTab("recent-bookings");
    }
  }, [router.query]);

  if (loading === "failed") {
    return (
      <div className="text-center font-medium text-red-400">
        Failed to load data!
      </div>
    );
  }

  if (loading === "loading" || loading === "idle") {
    return (
      <div className="text-center">
        <CgSpinner className="inline-block h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return preBookingStats ? (
    <div className="space-y-6">
      <BookingData preBookingStats={preBookingStats} />

      <div className="h-auto w-full overflow-hidden rounded-[14px] border border-gray-shade-3 bg-black-shade-3">
        <div className="flex items-center gap-6 overflow-x-auto rounded-t-[14px] bg-elevation-1 py-6 px-4 font-semibold text-white fsm:gap-8 fsm:px-8">
          <button
            onClick={() => {
              router.push({
                pathname: AppRoutes.launchpad_pre_booking,
                query: { tab: "recent-bookings" },
              });
            }}
            className={clsx(
              `whitespace-nowrap text-sm fsm:text-base`,
              bookingsTab === "recent-bookings" && "text-brand-primary"
            )}
          >
            Recent Bookings
          </button>
          <button
            onClick={() => {
              router.push({
                pathname: AppRoutes.launchpad_pre_booking,
                query: { tab: "my-bookings" },
              });
            }}
            className={clsx(
              `whitespace-nowrap text-sm fsm:text-base`,
              bookingsTab === "my-bookings" && "text-brand-primary"
            )}
          >
            My Bookings
          </button>
          <button
            onClick={() => {
              router.push({
                pathname: AppRoutes.launchpad_pre_booking,
                query: { tab: "my-rewards" },
              });
            }}
            className={clsx(
              `whitespace-nowrap text-sm fsm:text-base`,
              bookingsTab === "my-rewards" && "text-brand-primary"
            )}
          >
            My Rewards
          </button>
        </div>

        <hr className="border border-gray-shade-3" />

        {(bookingsTab === "recent-bookings" ||
          bookingsTab === "my-bookings") && (
          <BookingList
            recievableTokenSymbol={preBookingStats.receivable_token_symbol}
            rounds={preBookingStats.pre_booking.rounds}
            bookings={
              bookingsTab === "recent-bookings"
                ? preBookingStats.bookings.recent_bookings
                : bookingsTab === "my-bookings"
                ? preBookingStats.bookings.my_bookings
                : []
            }
          />
        )}

        {bookingsTab === "my-rewards" && (
          <RewardsList rewards={preBookingStats.my_rewards ?? []} />
        )}
      </div>
    </div>
  ) : null;
};

PreSale.getLayout = (page) => (
  <AllPagesWrapper pageTitle="DeXa Pre Booking">
    <div className="mx-auto min-h-screen w-full max-w-[1144px] bg-black-shade-3 pb-10 font-monto">
      {page}
    </div>
  </AllPagesWrapper>
);

export default PreSale;
