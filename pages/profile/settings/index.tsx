// React, Next, NPM Packages
import ctl from "@netlify/classnames-template-literals";

// App imports
import { NextPageWithLayout } from "@/pages/_app";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import EditProfileForm from "@/pages.components/profile.setting/edit.profile.form";

const Setting: NextPageWithLayout = () => {
  return (
    <div className="AppWrapper flex flex-col gap-10">
      <h1 className={title}>Profile Setting</h1>
      <EditProfileForm />
    </div>
  );
};

Setting.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Settings">{page}</AllPagesWrapper>;
};

export default Setting;

const title = ctl(`
textGradient  font-semibold leading-[42px]  pb-6 animationTextHeading text-34px
`);
