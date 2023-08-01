import useUser from "@/hooks/use.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import ProfileSettingSkeleton from "@/components/loading.skeletons/profile.setting.skeleton";

import SettingsSidebar from "./_components/settings.sidebar";
import { AboutForm } from "./_components/about.form";
import SettingsTopBar from "./_components/settings.topbar";

const About: NextPageWithLayout = () => {
  const { user } = useUser();

  return (
    <div className="w-full max-w-[640px] px-3 fsm:px-5 fmd:px-0">
      <h6 className="mb-10 text-xl font-semibold leading-7 text-white">
        About Settings
      </h6>

      {user ? <AboutForm user={user} /> : <ProfileSettingSkeleton />}
    </div>
  );
};

About.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Settings" showSidebar={false}>
      <div className="flex flex-col justify-center fsm:gap-5 flg:flex-row flg:gap-10">
        <span className="hidden flg:block">
          <SettingsSidebar />
        </span>
        <span className="block flg:hidden">
          <SettingsTopBar />
        </span>
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default About;
