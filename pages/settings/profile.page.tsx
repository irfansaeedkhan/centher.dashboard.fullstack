import Image from "next/image";
import useUser from "@/hooks/use.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { SettingsPagesWrapper, ProfileForm } from "./_components";

const Profile: NextPageWithLayout = () => {
  const { user } = useUser();

  return (
    <div>
      <h6 className="mb-10 text-xl font-semibold leading-7 text-white">
        Profile Settings
      </h6>

      {user ? (
        <ProfileForm user={user} />
      ) : (
        <div className="flex h-[calc(100vh-40px)] w-full justify-center">
          <Image
            src="/images/preloader.png"
            alt="preloader"
            width={64}
            height={64}
            className="h-16 w-16 flex-shrink-0 object-cover"
          />
        </div>
      )}
    </div>
  );
};

Profile.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Settings" showSidebar={false}>
      <SettingsPagesWrapper>{page}</SettingsPagesWrapper>
    </AllPagesWrapper>
  );
};

export default Profile;
