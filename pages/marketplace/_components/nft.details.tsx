import React, { useState } from "react";
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
  // Portfolio-library fix (Centher item 6): the old Details button had
  // no handler at all — the body was always rendered, so clicking it
  // produced no visible change. It is a real toggle now, expanded by
  // default to preserve the previous visible content.
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className={`w-full`}>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header mb-0" id="headingOne">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
              className={`accordion-button relative mb-3 flex w-full items-center justify-between rounded-none border-b-2 border-gray-shade-3 !bg-transparent  py-4 text-left text-base font-semibold text-white transition focus:outline-none`}
            >
              <span>Details</span>
              <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>
          </h2>
          {isOpen && (
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
                    {/* Portfolio-library fix (Centher item 6): an empty
                        mint hash used to render an empty link heading.
                        Label it as unavailable instead of linking
                        nowhere. */}
                    {nft.mintHash ? (
                      <a
                        href={formatTxUrl(nft.mintHash)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <h6 className={value}>{formatAddress(nft.mintHash)}</h6>
                      </a>
                    ) : (
                      <h6 className={value}>Not available</h6>
                    )}
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
          )}
        </div>
      </div>
    </div>
  );
};

const detailBox = `flex flex-col gap-2`;
const title = `text-gray-shade-2 text-xs font-normal`;
const value = `text-sm text-white font-semibold`;
