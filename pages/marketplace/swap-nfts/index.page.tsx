import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import useUser from "@/hooks/use.user";
import { formatIPFSUrl } from "@/utils/format.address";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { useWallet } from "@/web3/hooks/use.wallet";
import { BlockchainRead, BlockchainWrite } from "@/web3/blockchain";
import { SwapCollection } from "@/web3/blockchain/config";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import Button from "@/components/button";
import TrxModal from "@/components/modal/trx-modal";
import TrxStatus from "@/components/modal/trx-status";
import { customLog } from "@/utils/custom.log";
import { NextPageWithLayout } from "../../_app.page";

type NftType = {
  creator: string;
  image: string;
  ipfs: string;
  owner: string;
  price: string;
  tokenId: string;
};

const SwapNfts: NextPageWithLayout = () => {
  const { user } = useUser();
  const { getSigner, getProvider } = useWallet();
  const [isLoading, setIsLoading] = useState(true);
  const [userNfts, setUserNfts] = useState<NftType[]>([]);
  const [trxModal, setTrxModal] = useState<
    "trx-success" | "trx-fail" | "trx-progress" | null
  >("trx-success");

  useEffect(() => {
    (async () => {
      try {
        const provider = getProvider();
        if (!user || !provider) return;

        setIsLoading(true);

        const { nfts } = await BlockchainRead.getUserCollectionNfts(
          SwapCollection,
          user._id
        );

        const filteredNfts: NftType[] = (
          await Promise.all(
            nfts.map(async (nft: any) => {
              const result = await BlockchainRead.isTokenSwaped(
                provider,
                SwapCollection,
                nft.tokenId
              );

              if (!result) {
                return nft;
              } else {
                return null;
              }
            })
          )
        ).filter((nft) => nft !== null);

        const filteredNftsWithImage = await Promise.all(
          filteredNfts.map(async (nft: any) => {
            const ipfsUrl = nft.ipfs;

            const { data } = await axios.get(formatIPFSUrl(ipfsUrl));

            const imageUrl = formatIPFSUrl(data.image);

            return {
              ...nft,
              image: imageUrl,
            };
          })
        );

        setUserNfts(filteredNftsWithImage);
        setIsLoading(false);
      } catch (err: any) {
        setUserNfts([]);
        setIsLoading(false);
        customLog(["development", "staging"], err);
      }
    })();
  }, [user, getProvider]);

  const handleSwap = async (tokenId: string) => {
    try {
      setTrxModal("trx-progress");

      const signer = getSigner();
      if (!signer) return;

      await BlockchainWrite.swapDexagon(
        signer,
        SwapCollection,
        Number(tokenId)
      );

      setTrxModal("trx-success");
    } catch (err: any) {
      setTrxModal("trx-fail");
      customLog(["development", "staging"], err);
    }
  };

  return (
    <>
      <TrxModal
        open={trxModal === "trx-progress"}
        onClose={() => setTrxModal(null)}
      />

      <TrxStatus
        open={trxModal === "trx-success" || trxModal === "trx-fail"}
        onClose={() => setTrxModal(null)}
        title={
          trxModal === "trx-success"
            ? "Transaction Successfully"
            : "Transaction Failed"
        }
        description={
          trxModal === "trx-success"
            ? "Your transaction has been successfully completed."
            : "Your transaction has been failed."
        }
        success={trxModal === "trx-success"}
      />
      <div className="p-4">
        <div className="textGradient text-lg font-semibold fsm:text-2xl">
          Swap NFT
        </div>
        {userNfts.length > 0 ? (
          userNfts.map((nft: NftType) => (
            <div
              key={nft.tokenId}
              className="mt-4 grid grid-cols-1 gap-3 fmd:grid-cols-2"
            >
              <div className="col-span-1 flex h-[72px] w-full max-w-[1012px] rounded-2xl bg-[#1B1C22]">
                <Image
                  alt="Swap Nfts"
                  src={nft.image}
                  className="m-4 rounded-2xl object-contain"
                  height={40}
                  width={40}
                />
                <div className="flex-grow">
                  <div className="flex">
                    <div className="flex-grow">
                      <div className="mt-4 text-sm font-medium text-white ">
                        Token Id: {nft.tokenId}
                      </div>
                      <div className="text-xs font-normal text-[#888DAA]">
                        {sliceAccountAddress(nft.owner)}
                      </div>
                    </div>

                    <div className="mr-4 flex shrink-0 justify-end gap-x-3">
                      <Button
                        title="Swap"
                        variant="primary"
                        borderRounded="10px"
                        className="mt-4 h-[32px] w-[60px] text-xs font-medium fsm:h-[40px] fsm:w-[74px] fsm:text-sm"
                        onClick={() => handleSwap(nft.tokenId)}
                        value={nft.tokenId}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : isLoading && userNfts.length === 0 ? (
          <div className="flex h-[calc(100vh-150px)] w-full items-center justify-center">
            <Image
              src="/images/preloader.png"
              alt="preloader"
              width={64}
              height={64}
              className="h-16 w-16 flex-shrink-0 object-cover"
            />
          </div>
        ) : (
          <div className="mx-auto mt-4 text-center text-xl font-medium text-white">
            You don&apos;t have any NFT to swap
          </div>
        )}
      </div>
    </>
  );
};

SwapNfts.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Swap Nfts">{page}</AllPagesWrapper>;
};

export default SwapNfts;
