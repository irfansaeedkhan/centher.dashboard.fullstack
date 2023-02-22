import useUser from "@/hooks/use.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import ProfileSettingSocialLinksSkeleton from "@/components/loading.skeletons/profile.setting.social.links";

import SettingsSidebar from "./_components/settings.sidebar";
import { SocialLinksForm } from "./_components/social.links.form";
import { BackButton } from "./_components/back.button";

const SocialLinks: NextPageWithLayout = () => {
  const { user } = useUser();

  return (
    <div className="w-full max-w-[640px] px-3 fsm:px-5 fmd:px-0">
      <BackButton />

      <h6 className="mb-10 text-xl font-semibold leading-7 text-white">
        Social Links
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
      <div className="flex justify-center fsm:gap-5 flg:gap-10">
        <span className="hidden flg:block">
          <SettingsSidebar />
        </span>
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default SocialLinks;
