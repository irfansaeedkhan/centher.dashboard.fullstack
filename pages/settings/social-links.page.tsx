import useUser from "@/hooks/use.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import ProfileSettingSocialLinksSkeleton from "@/components/loading.skeletons/profile.setting.social.links";
import { SettingsPagesWrapper, SocialLinksForm } from "./_components";

const SocialLinks: NextPageWithLayout = () => {
  const { user } = useUser();

  return (
    <div className="w-full max-w-[640px] px-3 fsm:px-5 fmd:px-0">
      <h6 className="mb-10 text-xl font-semibold leading-7 text-white">
        Social Links Settings
      </h6>

      {user ? (
        <SocialLinksForm user={user} />
      ) : (
        <ProfileSettingSocialLinksSkeleton />
      )}
    </div>
  );
};

SocialLinks.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Settings" showSidebar={false}>
      <SettingsPagesWrapper>{page}</SettingsPagesWrapper>
    </AllPagesWrapper>
  );
};

export default SocialLinks;
