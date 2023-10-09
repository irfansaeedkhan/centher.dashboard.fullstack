import React from "react";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import PreBookingWrapper from "../_components/pre-booking-wrapper";
import BookingMain from "../_components/booking-main";

const PreSale: NextPageWithLayout = () => {
  return <BookingMain />;
};

PreSale.getLayout = (page) => (
  <AllPagesWrapper pageTitle="DeXa Pre Booking">
    <div className="mx-auto min-h-screen w-full max-w-[1144px] bg-black-shade-3 pb-10 font-monto">
      <PreBookingWrapper>{page}</PreBookingWrapper>
    </div>
  </AllPagesWrapper>
);

export default PreSale;
