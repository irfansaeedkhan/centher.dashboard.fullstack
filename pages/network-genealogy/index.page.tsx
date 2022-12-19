// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

// Current directory imports
import { Levels } from "./_components";

const ReferralProgram: NextPageWithLayout = () => {
  return <Levels />;
};

ReferralProgram.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Referral Program - Centher">
      {page}
    </AllPagesWrapper>
  );
};

export default ReferralProgram;
