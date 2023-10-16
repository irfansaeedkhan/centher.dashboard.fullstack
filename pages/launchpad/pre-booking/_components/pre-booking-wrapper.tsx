import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CgSpinner } from "react-icons/cg";
import Button from "@/components/button";
import useUser from "@/hooks/use.user";
import { usePreBookingStats } from "@/hooks/use-pre-booking-stats";
import { AppRoutes } from "@/constants/app.routes";
import BookingData from "../../_components/presale-components/booking-data";

interface Props {
  children?: React.ReactNode;
}

const PreBookingWrapper = ({ children }: Props) => {
  const { user } = useUser();
  const { loading, preBookingStats } = usePreBookingStats(user?._id);
  const router = useRouter();

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
      <div className="flex items-center gap-2">
        <Link href={AppRoutes.launchpad_pre_booking.index}>
          <Button
            title="Project Details"
            variant={
              router.pathname === AppRoutes.launchpad_pre_booking.index
                ? "primary"
                : "secondary"
            }
            className="rounded-[10px]"
          />
        </Link>
        <Link href={AppRoutes.launchpad_pre_booking.booking}>
          <Button
            title="Booking"
            variant={
              router.pathname === AppRoutes.launchpad_pre_booking.booking
                ? "primary"
                : "secondary"
            }
            className="rounded-[10px]"
          />
        </Link>
      </div>
      {children}
    </div>
  ) : null;
};

export default PreBookingWrapper;
