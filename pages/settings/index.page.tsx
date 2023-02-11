import { useEffect } from "react";
import { useRouter } from "next/router";
import { useMediaQuery } from "usehooks-ts";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AppRoutes } from "@/constants/app.routes";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

import SettingsSidebar from "./_components/settings.sidebar";

const Setting: NextPageWithLayout = () => {
  const router = useRouter();
  const matches = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    if (matches) {
      router.replace(AppRoutes.settings.profile);
    }
  }, [matches, router]);

  return null;
};

Setting.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Settings" showSidebar={false}>
      <div className="mx-auto flex max-w-[940px] px-2 py-2 fsm:gap-5 flg:gap-10">
        <SettingsSidebar />
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default Setting;
