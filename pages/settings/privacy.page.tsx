import useUser from "@/hooks/use.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import ProfileSettingPrivacySkeleton from "@/components/loading.skeletons/profile.setting.privacy.skeleton";
import { PrivacyForm, SettingsPagesWrapper } from "./_components";

const Privacy: NextPageWithLayout = () => {
  const { user } = useUser();

  return (
    <div className="w-full max-w-[640px] px-3 fsm:px-5 fmd:px-0">
      <h6 className="mb-10 text-xl font-semibold leading-7 text-white">
        Privacy Settings
      </h6>

      {user ? (
        <PrivacyForm />
      ) : (
        <div className="space-y-12">
          {Array.from({ length: 2 }).map((_, i) => {
            return <ProfileSettingPrivacySkeleton key={i} />;
          })}
        </div>
      )}
    </div>
  );
};

Privacy.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Settings" showSidebar={false}>
      <SettingsPagesWrapper>{page}</SettingsPagesWrapper>
    </AllPagesWrapper>
  );
};

export default Privacy;
