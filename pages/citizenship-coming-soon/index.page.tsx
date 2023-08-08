import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { AppRoutes } from "@/constants/app.routes";
import FinalButton from "@/components/button/final.button";
import { BuyCitizenshipModal } from "@/components/modal/buy-citizenship-modal";

const CitizenshipComingSoon: NextPageWithLayout = () => {
  const [showBuyCitizenshipModal, setShowBuyCitizenshipModal] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-60px-64px)] w-full items-center">
      <div className="relative flex h-full w-full items-center justify-center bg-[url('/images/comingsoon.png')] bg-top bg-no-repeat">
        <div className="flex flex-col items-center justify-center gap-5 pt-[13rem] fsm:mt-0">
          <div>
            <Image
              src="/images/centher-citizenship.png"
              alt="chat"
              width={300}
              height={300}
              className="absolute inset-0 top-0 mx-auto"
            />
          </div>
          <div className="text-center text-[16px] font-medium tracking-[8px] text-white sm:text-[20px] md:text-[28px] md:tracking-[10px]">
            Centher Citizenship
          </div>
          <div className="text-center text-[16px] font-medium tracking-[8px] text-white sm:text-[18px] md:text-[25px] md:tracking-[8px]">
            (Business Account)
          </div>
          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
            At Centher we are building an environment in which users who want to
            open a business account will get Centher Citizenship with Passport.
          </div>
          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
            This Passport will grant the users access to premium features like{" "}
            <Link
              className="text-brand-primary hover:text-brand-primary-dark"
              href={AppRoutes.staking_coming_soon}
            >
              Staking as a Service
            </Link>
            ,{" "}
            <Link
              className="text-brand-primary hover:text-brand-primary-dark"
              href={AppRoutes.marketplace.create_collection}
            >
              Create Collections
            </Link>
            , Bulk messaging via{" "}
            <Link
              className="text-brand-primary hover:text-brand-primary-dark"
              href={AppRoutes.chat_coming_soon}
            >
              Premium Chat Service
            </Link>
            , Advertising and much, much more!
          </div>
          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
            Get your Passport now{" "}
            <span
              className="cursor-pointer text-brand-primary hover:text-brand-primary-dark"
              onClick={() => setShowBuyCitizenshipModal(true)}
            >
              here
            </span>{" "}
            and become a{" "}
            <Link
              className="text-brand-primary hover:text-brand-primary-dark"
              href={AppRoutes.citizenship_coming_soon}
            >
              Centher Citizen
            </Link>{" "}
            to power up your business!
          </div>

          <FinalButton
            title="Get your passport"
            variant="primary"
            className="h-10 w-[200px] text-[14px]"
            borderRounded="14px"
            onClick={() => setShowBuyCitizenshipModal(true)}
          />
        </div>
      </div>
      {showBuyCitizenshipModal && (
        <BuyCitizenshipModal
          isOpen={showBuyCitizenshipModal}
          onClickClose={() => setShowBuyCitizenshipModal(false)}
        />
      )}
    </div>
  );
};

CitizenshipComingSoon.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Centher Citizenship Coming Soon">
      {page}
    </AllPagesWrapper>
  );
};

export default CitizenshipComingSoon;
