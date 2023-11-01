import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "@/pages/_app.page";
import { ArrowLeftSimpleIcon } from "@/assets/svgs";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { fetchNft, INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import { NFTLeftSideComponent, NFTRightSideComponent } from "../../_components";

const NFT: NextPageWithLayout = () => {
  const router = useRouter();
  const collection = router.query.collection;
  const tokenId = router.query.tokenId;
  const [nftData, setNftDatas] = useState<INFTDetailData>();
  const [reload, setReload] = useState<boolean>(false);

  useEffect(() => {
    async function fetchNFTData(collection: string, tokenId: number) {
      const result = await fetchNft(collection, tokenId);
      setNftDatas(result as any);
    }

    if ((collection as string) && tokenId) {
      fetchNFTData(collection as string, Number(tokenId as string));
    }
  }, [collection, reload, tokenId]);
  const setNftData = () => {
    setReload(!reload);
  };
  return (
    <>
      <Head>
        <title>{nftData?.name}</title>
      </Head>
      <div className="w-full pb-16">
        <button className={backBtn} onClick={() => router.back()}>
          <ArrowLeftSimpleIcon />
        </button>
        <div className="flex items-start gap-9 [@media(max-width:1279px)]:flex-col">
          <NFTLeftSideComponent
            image={nftData?.image}
            type={nftData?.type}
            nftId={nftData?.nftId}
            mintTx={nftData?.mintTx}
            collection={nftData?.collection}
            attributes={nftData?.attributes}
            collectionMintedTokens={
              !nftData?.collectionMintedTokens
                ? 0
                : +nftData.collectionMintedTokens
            }
          />
          <NFTRightSideComponent data={nftData} setNftData={setNftData} />
        </div>
      </div>
    </>
  );
};

NFT.getLayout = (page) => {
  return (
    <AllPagesWrapper>
      <div className={dashboardContentContainer}>
        <div className={feedContainer}>{page}</div>
      </div>
    </AllPagesWrapper>
  );
};

export default NFT;

// styling
const feedContainer = `flex flex-col lg:flex-row gap-5 lg:items-start`;
const backBtn = `bg-black-shade-10 rounded-full flex items-center justify-center w-12 h-12 mb-8`;
const dashboardContentContainer = `bg-black-shade-3 w-full h-full font-monto [@media(max-width:1279px)]:max-w-[544px] max-w-[1160px] mx-auto relative`;
