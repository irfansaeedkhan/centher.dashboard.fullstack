import useUser from "@/hooks/use.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import ProfileSettingSkeleton from "@/components/loading.skeletons/profile.setting.skeleton";
import SettingsSidebar from "./_components/settings.sidebar";
import CitizenshipUpdateDetails from "./_components/citizenship.form.update";
import SettingsTopBar from "./_components/settings.topbar";

const Citizen: NextPageWithLayout = () => {
  const { user } = useUser();

  return (
    <div className="w-full max-w-[640px] px-3 fsm:px-5 fmd:px-0">
      <h6 className="mb-10 text-xl font-semibold leading-7 text-white">
        Set up your Team Members
      </h6>

      {user ? <CitizenshipUpdateDetails /> : <ProfileSettingSkeleton />}
    </div>
  );
};

Citizen.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Team Members" showSidebar={false}>
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

export default Citizen;
