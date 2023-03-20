// React, Next, NPM Packages
import React from "react";

import {
  formatAddress,
  formatAddressUrl,
  formatTxUrl,
} from "@/utils/format.address";
interface NFTDetailsProps {
  nftId: number | undefined;
  mintTx: string | undefined;
  collection: string | undefined;
}
export const NFTDetails = (props: NFTDetailsProps) => {
  return (
    <div className={`w-full`}>
      <div className="accordion" id="accordionExample">
        {props && (
          <div className="accordion-item ">
            <h2 className="accordion-header mb-0" id="headingOne">
              <button className={AccordionButton}>Details</button>
            </h2>
            <div>
              <div className="accordion-body rounded-10px bg-background-shade-3 p-6">
                <div className={`flex flex-col gap-5`}>
                  <div className={detailBox}>
                    <h5 className={title}>NFT ID</h5>
                    <h6 className={value}>{props.nftId}</h6>
                  </div>
                  <div className={detailBox}>
                    <h5 className={title}>MINT TRANSACTION</h5>
                    <a
                      href={formatTxUrl(props.mintTx)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <h6 className={value}>{formatAddress(props.mintTx)}</h6>
                    </a>
                  </div>
                  <div className={detailBox}>
                    <h5 className={title}>CONTRACT ADDRESS</h5>
                    <a
                      href={formatAddressUrl(props.collection)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <h6 className={value}>
                        {formatAddress(props.collection)}
                      </h6>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
// styling

const AccordionButton = `
accordion-button relative flex items-center w-full py-4  text-base text-white text-left !bg-transparent  rounded-none transition focus:outline-none text-14px font-semibold border-b-2 border-gray-shade-3 mb-3
`;

const detailBox = `flex flex-col gap-2`;
const title = `text-gray-shade-2 text-12px font-normal`;
const value = `text-14px text-white font-semibold`;
