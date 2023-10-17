import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { AppRoutes } from "@/constants/app.routes";
import Button from "@/components/button";
import { BuyCitizenshipModal } from "@/components/modal/buy-citizenship-modal";
import useUser from "@/hooks/use.user";

const Citizenship: NextPageWithLayout = () => {
  const { user: loggedInUser } = useUser();
  const router = useRouter();
  const [showBuyCitizenshipModal, setShowBuyCitizenshipModal] = useState(false);

  const handleShowBuyCitizenshipModal = () => {
    if (loggedInUser?.membership.status === "citizen") {
      router.push(AppRoutes.settings.citizen.team_members);
      return;
    }
    setShowBuyCitizenshipModal(true);
  };

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
              className="text-gradient"
              href={AppRoutes.staking_coming_soon}
            >
              Staking as a Service
            </Link>
            , Create Collections, Bulk messaging via{" "}
            <Link className="text-gradient" href={AppRoutes.chat.index}>
              Premium Chat Service
            </Link>
            , Advertising and much, much more!
          </div>
          {loggedInUser?.membership.status !== "citizen" && (
            <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
              Get your Passport now and become a{" "}
              <span className="text-gradient">Centher Citizen</span> to power up
              your business!
            </div>
          )}

          <Button
            title={
              loggedInUser?.membership.status !== "citizen"
                ? "Get your passport"
                : "View your passport"
            }
            variant="primary"
            className="h-10 w-[200px] text-[14px]"
            borderRounded="14px"
            onClick={handleShowBuyCitizenshipModal}
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

Citizenship.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Centher Citizenship">{page}</AllPagesWrapper>
  );
};

export default Citizenship;
