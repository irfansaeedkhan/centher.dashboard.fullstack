import ctl from "@netlify/classnames-template-literals";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import ProfileSettingSkeleton from "@/components/loading.skeletons/profile.setting";
import useUser from "@/hooks/use.user";

import { EditProfileForm } from "./_components";

const Setting: NextPageWithLayout = () => {
  const { user } = useUser();

  return (
    <div className="otherAppWrapper flex flex-col sm:gap-5 lg:gap-10">
      <h1
        className={`textGradient animationTextHeading pb-6 font-semibold leading-[42px] sm:text-2xl lg:text-[34px]`}
      >
        Profile Setting
      </h1>
      {user ? <EditProfileForm user={user} /> : <ProfileSettingSkeleton />}
    </div>
  );
};

Setting.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Settings">{page}</AllPagesWrapper>;
};

export default Setting;
