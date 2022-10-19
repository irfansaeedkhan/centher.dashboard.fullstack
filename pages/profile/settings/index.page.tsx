// React, Next, NPM Packages
import ctl from "@netlify/classnames-template-literals";
import { Bars } from "react-loader-spinner";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import useUser from "@/hooks/use.user";

import { EditProfileForm } from "./_components";

const Setting: NextPageWithLayout = () => {
  const { user } = useUser();

  return (
    <div className="AppWrapper flex flex-col gap-10">
      <h1 className={title}>Profile Setting</h1>
      {user ? (
        <EditProfileForm user={user} />
      ) : (
        <div className="w-full flex justify-center items-center ">
          <Bars
            height="25"
            width="25"
            color="#FEBF32"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
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
