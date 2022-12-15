// React, Next, NPM Packages
import ctl from "@netlify/classnames-template-literals";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NFTLeftSideComponent, NFTRightSideComponent } from "../../_components";
import { ArrowLeftSimpleIcon } from "@/assets/svgs";
import { useRouter } from "next/router";
import { INFTDetailData, useGetNftData } from "@/hooks/use.get.nft.data.ts";
import { useState } from "react";

const NFT: NextPageWithLayout = () => {
  const [reload, setReload] = useState(false);
  const router = useRouter();
  const collection = router.query.collection;
  const tokenId = router.query.tokenId;

  const data: INFTDetailData | undefined = useGetNftData(
    collection,
    tokenId,
    reload
  );

  console.log("NFT DATA", data?.image);

  return (
    <div className="w-full pb-16">
      <button className={backBtn} onClick={() => router.back()}>
        <ArrowLeftSimpleIcon />
      </button>
      <div className="flex gap-9 items-start [@media(max-width:1279px)]:flex-col">
        <NFTLeftSideComponent
          image={data?.image}
          type={data?.type}
          nftId={data?.nftId}
          mintTx={data?.mintTx}
          collection={data?.collection}
          attributes={data?.attributes}
        />
        <NFTRightSideComponent
          data={data}
          reload={reload}
          setReload={setReload}
        />
      </div>
    </div>
  );
};

NFT.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="View NFT">
      <div className={dashboardContentContainer}>
        <div className={feedContainer}>{page}</div>
      </div>
    </AllPagesWrapper>
  );
};

export default NFT;

// styling
const dashboardContentContainer = ctl(`
 bg-black-shade-3 w-full h-full font-monto [@media(max-width:1279px)]:max-w-[544px] max-w-[1160px] mx-auto relative 
`);
const backBtn = ctl(`
bg-black-shade-10 rounded-full flex items-center justify-center w-12 h-12
mb-8
`);
const feedContainer = ctl(`
flex flex-col lg:flex-row  gap-5 lg:items-start 
`);
