// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";
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
    <div className={NFTDetailsContainer}>
      <div className="accordion" id="accordionExample">
        {props && (
          <div className="accordion-item bg-transparent ">
            <h2 className="accordion-header mb-0" id="headingOne">
              <button
                className={AccordionButton}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#detailsComponent"
                aria-expanded="true"
                aria-controls="detailsComponent"
              >
                Details
              </button>
            </h2>
            <div
              id="detailsComponent"
              className={AccordionCollapse}
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body p-6">
                <div className={detailsList}>
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
const NFTDetailsContainer = ctl(`
w-full 
`);
const AccordionButton = ctl(`
accordion-button relative flex items-center w-full py-4 px-5 text-base text-white text-left !bg-transparent  rounded-none transition focus:outline-none text-14px font-semibold border-b-2 border-gray-shade-3 mb-3
`);
const AccordionCollapse = ctl(`
accordion-collapse collapse show bg-background-shade-3 rounded-10px
`);
const detailBox = ctl(`
flex flex-col gap-2
`);
const title = ctl(`
text-gray-shade-2 text-12px font-normal
`);
const value = ctl(`
text-14px text-white font-semibold
`);
const detailsList = ctl(`
flex flex-col gap-5
`);
