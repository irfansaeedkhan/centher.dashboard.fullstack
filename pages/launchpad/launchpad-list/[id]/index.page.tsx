import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";
import { useLaunchpad } from "@/hooks/launchpad";
import { PresaleDataType } from "../_components/launchpad-card-data";
import { PresaleData, ReferralData } from "./_components";
import { formatIPFSUrl } from "@/utils/format.address";
import axios from "axios";

const LaunchpadListDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const { sdk } = useLaunchpad();
  const [loading, setLoading] = useState<boolean>(false);
  const [launchpadData, setLaunchpadData] = useState<PresaleDataType>();
  const [metaData, setMetaData] = useState<{
    token_name: string;
    token_symbol: string;
    website: string;
  }>();

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!sdk) {
        setLoading(false);
        return;
      }
      if (!id) {
        setLoading(false);
        return;
      }
      const result: PresaleDataType = await sdk.getPresale(id.toString());
      const metaData = await axios.get(formatIPFSUrl(result.metadata));
      setLaunchpadData(result);
      console.log(metaData.data);
      setMetaData({
        token_name: metaData.data.token_name,
        token_symbol: metaData.data.token_symbol,
        website: metaData.data.website_url,
      });
      setLoading(false);
      console.log(result);
    })();
  }, [sdk, id]);

  return !loading && launchpadData && metaData ? (
    <div className="flex flex-col gap-6 flg:flex-row">
      <div className="flex flex-grow flex-col gap-4">
        <PresaleData {...launchpadData} {...metaData} />
        <ReferralData {...launchpadData} />
      </div>
      <div className="flex w-[312px] flex-shrink-0 flex-col gap-4 fsm:flex-row flg:flex-col">
        <div className="h-[202px] w-full rounded-xl bg-black-shade-9 p-4 fxm:p-6"></div>
        <div className="h-[104px] w-full rounded-xl bg-black-shade-9 p-4 fxm:p-6"></div>
      </div>
    </div>
  ) : (
    <div className="flex h-[calc(100vh-60px)] w-full items-center justify-center">
      <Image
        src="/images/preloader.png"
        alt="Preloader"
        width={64}
        height={64}
        className="size-16 flex-shrink-0 object-cover"
      />
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
