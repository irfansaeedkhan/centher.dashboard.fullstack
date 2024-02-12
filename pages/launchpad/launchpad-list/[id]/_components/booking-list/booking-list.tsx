import React, { useState } from "react";
import clsx from "clsx";
import useUser from "@/hooks/use.user";
import { MainTimeline, MyBookingsTable } from "./";
import {
  PresaleDataType,
  TokenPurchaseWithBNB,
  TokenPurchaseWithBUSD,
} from "../../../_components/launchpad-card-data";

export const BookingList: React.FC<PresaleDataType> = (props) => {
  const [roundNumber, setRoundNumber] = useState<number>(0);
  const [purchaseTime, setPurchaseTime] = useState<number>(0);
  const [bookingsTab, setBookingsTab] = useState<
    "my-bookings" | "recent-bookings"
  >("my-bookings");

  const { user } = useUser();

  let bookings: TokenPurchaseWithBNB[] | TokenPurchaseWithBUSD[];
  let myBookings: TokenPurchaseWithBNB[] | TokenPurchaseWithBUSD[] = [];

  if (props.fundType === 0) {
    bookings = props.tokenPurchaseWithBNB;
  } else {
    bookings = props.tokenPurchaseWithBUSD;
  }

  for (let i = 0; i < bookings.length; i++) {
    const currentRoundPrice =
      props.roundInfos[Number(bookings[i].round)].pricePerToken;
    const receivable =
      (Number(bookings[i].amount) * 1e18) / Number(currentRoundPrice);

    bookings[i].receivable = receivable.toString();
    bookings[i].pricePerToken = currentRoundPrice;
  }

  for (let i = 0; i < bookings.length; i++) {
    if (user?._id === bookings[i].beneficiary) {
      myBookings.push(bookings[i]);
    }
  }
  // console.log("BookingList -> myBookings", myBookings);
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
        <MyBookingsTable
          setRoundNumber={setRoundNumber}
          setPurchaseTime={setPurchaseTime}
          bookingsTab={bookingsTab}
          {...props}
          bookings={bookingsTab === "my-bookings" ? myBookings : bookings}
        />
      </div>
      {bookingsTab === "my-bookings" && roundNumber !== 0 && (
        <MainTimeline
          {...props}
          roundNumber={roundNumber}
          lockMonths={Number(props.roundInfos[0].lockMonths)}
          purchaseTime={purchaseTime}
        />
      )}
    </div>
  );
};

const defaultClass =
  "w-fit flex-shrink-0 cursor-pointer py-1 text-xs leading-5 text-white fxm:text-sm fxm:leading-6";
const selectedClass = "myBox font-medium";
