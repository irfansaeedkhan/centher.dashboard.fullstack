import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";
import { useLaunchpad } from "@/hooks/launchpad";
import { formatIPFSUrl } from "@/utils/format.address";
import { DetailsTabsWrapper } from "./_components/details-tabs-wrapper";
import { PresaleDataType } from "../_components/launchpad-card-data";
import { BookingList, LaunchpadOverview, ReferralRewards } from "./_components";
import { customLog } from "@/utils/custom.log";

const LaunchpadListDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const { id, list_type } = router.query;
  const { sdk } = useLaunchpad();
  const [loading, setLoading] = useState<boolean>(false);
  const [launchpadData, setLaunchpadData] = useState<PresaleDataType>();
  const [metaData, setMetaData] = useState<{
    token_name: string;
    token_symbol: string;
    website: string;
    description: string;
  }>();

  const loadSdk = useCallback(async () => {
    try {
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

      setMetaData({
        token_name: metaData.data.token_name,
        token_symbol: metaData.data.token_symbol,
        website: metaData.data.website_url,
        description: metaData.data.description,
      });
      setLoading(false);
    } catch (err) {
      customLog(["development", "staging"], err);
    }
  }, [id, sdk]);

  useEffect(() => {
    loadSdk();
  }, [loadSdk]);

  return !loading && launchpadData && metaData ? (
    list_type === "launchpad_overview" ? (
      <LaunchpadOverview
        launchpadData={launchpadData}
        metaData={metaData}
        loadSdk={loadSdk}
      />
    ) : list_type === "booking_list" ? (
      <BookingList
        {...launchpadData}
        token_name={metaData.token_name}
        token_symbol={metaData.token_symbol}
      />
    ) : list_type === "referral_rewards" ? (
      <ReferralRewards launchpadData={launchpadData} metaData={metaData} />
    ) : null
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
    <DetailsTabsWrapper>{page}</DetailsTabsWrapper>
  </AllPagesWrapper>
);

export default LaunchpadListDetails;
