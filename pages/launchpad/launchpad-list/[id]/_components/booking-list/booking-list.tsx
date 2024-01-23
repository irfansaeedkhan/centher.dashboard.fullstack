import React, { useState } from "react";
import clsx from "clsx";
import { MainTimeline, MyBookingsTable } from "./";

export const BookingList = () => {
  const [bookingsTab, setBookingsTab] = useState<
    "my-bookings" | "recent-bookings"
  >("my-bookings");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex h-auto w-full flex-col overflow-hidden rounded-[14px] border border-gray-shade-3 bg-black-shade-3">
        <div className="flex items-center gap-8 overflow-x-auto bg-elevation-1 px-8 py-[18px]">
          <button
            onClick={() => setBookingsTab("my-bookings")}
            className={clsx(
              defaultClass,
              bookingsTab === "my-bookings" && selectedClass
            )}
          >
            My Bookings
          </button>
          <button
            onClick={() => setBookingsTab("recent-bookings")}
            className={clsx(
              defaultClass,
              bookingsTab === "recent-bookings" && selectedClass
            )}
          >
            Recent Bookings
          </button>
        </div>
        <MyBookingsTable bookingsTab={bookingsTab} />
      </div>
      <MainTimeline />
    </div>
  );
};

const defaultClass =
  "w-fit flex-shrink-0 cursor-pointer py-1 text-xs leading-5 text-white fxm:text-sm fxm:leading-6";
const selectedClass = "myBox font-medium";
