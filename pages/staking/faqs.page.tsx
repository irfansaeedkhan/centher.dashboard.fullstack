import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useUser from "@/hooks/use.user";
import { AppRoutes } from "@/constants/app.routes";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { BuyCitizenshipModal } from "@/components/modal/buy-citizenship-modal";
import Button from "@/components/button";
import { NextPageWithLayout } from "../_app.page";
import { faqsData } from "./_components/faqs-data";
import SingleFaq from "./_components/single-faq";

const Faqs: NextPageWithLayout = () => {
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const [showBuyCitizenshipModal, setShowBuyCitizenshipModal] = useState(false);
  return (
    <div className="mx-auto flex w-full max-w-[1144px] flex-col gap-6">
      <div className="flex items-center justify-between gap-10">
        <div className="flex w-full flex-col gap-5 fsm:w-fit fsm:flex-row fsm:items-center fsm:justify-start flg:gap-6">
          <Link
            href={AppRoutes.staking.index}
            className="textGradient text-2xl font-semibold"
          >
            Staking
          </Link>
          <div className="flex w-full items-center gap-5 flg:gap-6">
            <Button
              className="h-9 w-full text-xs fsm:min-w-max [@media(max-width:330px)]:text-[11px]"
              title="Create New Project"
              variant="secondary"
              borderRounded="10px"
              onClick={
                loggedInUser?.membership.status === "citizen"
                  ? () =>
                      router.push({
                        pathname: AppRoutes.staking.create_staking,
                      })
                  : () => setShowBuyCitizenshipModal(true)
              }
            />
            <Link href={AppRoutes.staking.faqs} className="w-full">
              <Button
                title="FAQs"
                variant={"primary"}
                className="h-9 w-full text-xs fsm:max-w-[68px]"
                borderRounded="10px"
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4">
        {faqsData.map((faq) => {
          return <SingleFaq faq={faq} key={faq.id} />;
        })}
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

export default Faqs;

Faqs.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Staking FAQs">{page}</AllPagesWrapper>;
};
