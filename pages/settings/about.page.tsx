import Image from "next/image";
import useUser from "@/hooks/use.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { BackButton } from "@/components/button/back-button";
import { SettingsPagesWrapper, AboutForm } from "./_components";

const About: NextPageWithLayout = () => {
  const { user } = useUser();

  return (
    <div className="w-full max-w-[640px] px-3 fsm:px-5 fmd:px-0">
      <BackButton className="flg:hidden" />
      <h6 className="mb-10 text-xl font-semibold leading-7 text-white">
        About Settings
      </h6>

      {user ? (
        <AboutForm user={user} />
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

About.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Settings" showSidebar={false}>
      <SettingsPagesWrapper>{page}</SettingsPagesWrapper>
    </AllPagesWrapper>
  );
};

export default About;
