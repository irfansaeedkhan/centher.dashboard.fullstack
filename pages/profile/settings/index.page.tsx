// React, Next, NPM Packages
import ctl from "@netlify/classnames-template-literals";
import { Bars } from "react-loader-spinner";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import useUser from "@/hooks/use.user";

import { EditProfileForm } from "./_components";
import ProfileSettingSkeleton from "@/components/loading.skeletons/profile.setting";

const Setting: NextPageWithLayout = () => {
  const { user } = useUser();

  return (
    <div className="otherAppWrapper flex flex-col lg:gap-10 sm:gap-5">
      <h1 className={title}>Profile Setting</h1>
      {user ? <EditProfileForm user={user} /> : <ProfileSettingSkeleton />}
    </div>
  );
};

Setting.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Settings">{page}</AllPagesWrapper>;
};

export default Setting;

const title = ctl(`
textGradient  font-semibold leading-[42px]  pb-6 animationTextHeading lg:text-[34px] sm:text-2xl
`);
