import React, { useEffect } from "react";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";
import { useRouter } from "next/router";
import { useLaunchpad } from "@/hooks/launchpad";
import { PresaleDataType } from "../_components/launchpad-card-data";

const LaunchpadListDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);

  const { sdk } = useLaunchpad();

  useEffect(() => {
    (async () => {
      if (!sdk) return;
      if (!id) return;

      const result: PresaleDataType = await sdk.getPresale(id.toString());
      console.log(result);
    })();
  }, [sdk, id]);

  return (
    <div className="flex flex-col gap-6 flg:flex-row">
      <div className="flex flex-grow flex-col gap-4">
        <div className="h-[544px] w-full rounded-xl bg-black-shade-9 p-4 fxm:p-6"></div>
        <div className="h-[228px] w-full rounded-xl bg-black-shade-9 p-4 fxm:p-6"></div>
      </div>
      <div className="flex w-[312px] flex-shrink-0 flex-col gap-4 fsm:flex-row flg:flex-col">
        <div className="h-[202px] w-full rounded-xl bg-black-shade-9 p-4 fxm:p-6"></div>
        <div className="h-[104px] w-full rounded-xl bg-black-shade-9 p-4 fxm:p-6"></div>
      </div>
    </div>
  );
};

LaunchpadListDetails.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Launchpad List">
    <div className="mx-auto min-h-screen w-full max-w-[1112px] bg-black-shade-3 pb-10 font-monto">
      {page}
    </div>
  </AllPagesWrapper>
);

export default LaunchpadListDetails;
