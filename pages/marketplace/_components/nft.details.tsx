import React from "react";
import {
  formatAddress,
  formatAddressUrl,
  formatTxUrl,
} from "@/utils/format.address";
import { CFSNFTForPage } from "@/lib/get-single-nft-page-data/types";

interface Props {
  nft: CFSNFTForPage;
}

export const NFTDetails: React.FC<Props> = ({ nft }) => {
  return (
    <div className={`w-full`}>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header mb-0" id="headingOne">
            <button
              className={`accordion-button relative mb-3 flex w-full items-center  rounded-none border-b-2 border-gray-shade-3 !bg-transparent  py-4 text-left text-base font-semibold text-white transition focus:outline-none`}
            >
              Details
            </button>
          </h2>
          <div>
            <div className="accordion-body rounded-10px bg-background-shade-3 p-6">
              <div className={`flex flex-col gap-5`}>
                <div className={detailBox}>
                  <h5 className={title}>NFT ID</h5>
                  <h6 className={value}>
                    {nft.tokenId ?? 0}/{nft.collectionInfo.totalSupply ?? 0}
                  </h6>
                </div>
                <div className={detailBox}>
                  <h5 className={title}>MINT TRANSACTION</h5>
                  <a
                    href={formatTxUrl(nft.mintHash)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <h6 className={value}>{formatAddress(nft.mintHash)}</h6>
                  </a>
                </div>
                <div className={detailBox}>
                  <h5 className={title}>CONTRACT ADDRESS</h5>
                  <a
                    href={formatAddressUrl(nft.collection)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <h6 className={value}>{formatAddress(nft.collection)}</h6>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const detailBox = `flex flex-col gap-2`;
const title = `text-gray-shade-2 text-xs font-normal`;
const value = `text-sm text-white font-semibold`;
