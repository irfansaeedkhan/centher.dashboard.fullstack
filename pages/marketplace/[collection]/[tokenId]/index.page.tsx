import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { getSingleNFTPageData } from "@/lib/get-single-nft-page-data";
import { CFSNFTForPage } from "@/lib/get-single-nft-page-data/types";
import useUser from "@/hooks/use.user";
import { BackButton } from "@/components/button/back-button";
import { NFTLeftSideComponent, NFTRightSideComponent } from "../../_components";

const NFT: NextPageWithLayout = () => {
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const [nft, setNft] = useState<CFSNFTForPage>();

  const fetchNFT = useCallback(async () => {
    if (router.query.collection && router.query.tokenId) {
      getSingleNFTPageData({
        collection_address: router.query.collection.toString(),
        token_id: router.query.tokenId.toString(),
      })
        .then((data) => {
          setNft(data);
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  }, [router.query]);

  const refetchNFT = useCallback(() => {
    fetchNFT();
  }, [fetchNFT]);

  useEffect(() => {
    fetchNFT();
  }, [fetchNFT]);

  return nft && loggedInUser ? (
    <>
      <Head>
        <title>{nft.ipfs_metadata.name}</title>
      </Head>
      <div className="w-full pb-16">
        <BackButton />
        <div className="flex items-start gap-9 [@media(max-width:1279px)]:flex-col">
          <NFTLeftSideComponent nft={nft} />
          <NFTRightSideComponent
            nft={nft}
            refetchNFT={refetchNFT}
            loggedInUser={loggedInUser}
          />
        </div>
      </div>
    </>
  ) : null; // TODO: Add a loading spinner and 404 page
};

NFT.getLayout = (page) => {
  return (
    <AllPagesWrapper>
      <div
        className={`relative mx-auto h-full w-full max-w-[1160px] bg-black-shade-3 font-monto [@media(max-width:1279px)]:max-w-[544px]`}
      >
        <div className={`flex flex-col gap-5 flg:flex-row flg:items-start`}>
          {page}
        </div>
      </div>
    </AllPagesWrapper>
  );
};

export default NFT;
