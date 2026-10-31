import React, { useEffect, useState } from "react";
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

  const isCitizen = loggedInUser?.membership.status === "citizen";

  // Portfolio-library fix (2026-10-29): "View your passport" used to
  // route to Settings Team Members, which has no passport card or modal
  // — a dead end. No passport view existed anywhere in code, so the
  // citizenship page itself now carries the passport section below, and
  // every "view passport" entry point routes here (?view=passport).
  useEffect(() => {
    if (router.query.view === "passport" && isCitizen) {
      document
        .getElementById("passport")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [router.query.view, isCitizen]);

  const handleShowBuyCitizenshipModal = () => {
    if (isCitizen) {
      document
        .getElementById("passport")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setShowBuyCitizenshipModal(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-60px-64px)] w-full flex-col items-center">
      {isCitizen && loggedInUser && (
        <section
          id="passport"
          aria-label="Citizen Passport"
          className="w-full max-w-[544px] rounded-2xl border border-gray-shade-3 bg-background-shade-3 p-6"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-shade-7">
            Citizen Passport
          </p>
          <div className="mt-4 flex items-center gap-4">
            {loggedInUser.profile_image && (
              <Image
                src={loggedInUser.profile_image}
                alt={loggedInUser.display_name}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover"
              />
            )}
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-white">
                {loggedInUser.display_name}
              </p>
              <p className="text-sm text-gray-shade-7">
                Status:{" "}
                <span className="font-semibold text-white">Citizen</span>
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-shade-7">
            This passport opens premium features: Staking as a Service, Create
            Collections, Premium Chat Service, Advertising, and more.
          </p>
          <Link
            href={AppRoutes.settings.citizen.team_members}
            className="text-gradient mt-4 inline-block text-sm font-semibold"
          >
            Manage team members →
          </Link>
        </section>
      )}
      <div className="relative flex h-full w-full items-center justify-center bg-[url('/images/comingsoon.png')] bg-top bg-no-repeat">
        <div className="flex flex-col items-center justify-center gap-5 pt-[13rem] fsm:mt-0">
          <div>
            <Image
              src="/images/citizenship.png"
              alt="chat"
              width={300}
              height={300}
              className="absolute inset-0 top-0 mx-auto"
            />
          </div>
          <div className="text-center text-[16px] font-medium tracking-[8px] text-white sm:text-[20px] md:text-[28px] md:tracking-[10px]">
            {"Sociaket"} Citizenship
          </div>
          <div className="text-center text-[16px] font-medium tracking-[8px] text-white sm:text-[18px] md:text-[25px] md:tracking-[8px]">
            (Business Account)
          </div>
          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
            At {"Sociaket"} we are building a place where anyone opening a
            business account gets
            {"Sociaket"} Citizenship with a Passport.
          </div>
          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
            This Passport opens premium features like{" "}
            <Link
              className="text-gradient"
              href={AppRoutes.staking_coming_soon}
            >
              Staking as a Service
            </Link>
            , Create Collections, bulk messaging through the{" "}
            <Link className="text-gradient" href={AppRoutes.chat.index}>
              Premium Chat Service
            </Link>
            , Advertising, and plenty more!
          </div>
          {loggedInUser?.membership.status !== "citizen" && (
            <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
              Grab your Passport now and become a{" "}
              <span className="text-gradient">{"Sociaket"} Citizen</span> to
              give your business a boost!
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
    <AllPagesWrapper pageTitle="Sociaket Citizenship">{page}</AllPagesWrapper>
  );
};

export default Citizenship;
