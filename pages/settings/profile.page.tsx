import useUser from "@/hooks/use.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import ProfileSettingSkeleton from "@/components/loading.skeletons/profile.setting.skeleton";

import SettingsSidebar from "./_components/settings.sidebar";
import { ProfileForm } from "./_components/profile.form";
import { BackButton } from "./_components/back.button";

const Profile: NextPageWithLayout = () => {
  const { user } = useUser();

  return (
    <div className="w-full max-w-[884px] px-3 fsm:px-5 fmd:px-0">
      <BackButton />

      <h6 className="mb-10 text-xl font-semibold leading-7 text-white">
        Profile
      </h6>

      {user ? <ProfileForm user={user} /> : <ProfileSettingSkeleton />}
    </div>
  );
};

Profile.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Settings" showSidebar={false}>
      <div className="flex justify-center fsm:gap-5 flg:gap-10">
        <span className="hidden flg:block">
          <SettingsSidebar />
        </span>
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default Profile;
