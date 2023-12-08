import React from "react";
import { CFSNFTForPage } from "@/lib/get-single-nft-page-data/types";

interface Props {
  attributes: CFSNFTForPage["ipfs_metadata"]["attributes"];
}

export const NFTProperties: React.FC<Props> = ({ attributes }) => {
  return attributes.length ? (
    <div className={`w-full`}>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item ">
          <h2 className="accordion-header mb-0" id="headingOne">
            <button
              className={`accordion-button relative mb-3 flex w-full items-center  rounded-none border-b-2 border-gray-shade-3 !bg-transparent  py-4 text-left text-base font-semibold text-white transition focus:outline-none`}
            >
              Properties
            </button>
          </h2>
          <div>
            <div className="accordion-body rounded-10px bg-background-shade-3 p-6">
              <div className={`flex flex-wrap gap-[2%]`}>
                {attributes.map((attribute, index) => (
                  <div
                    className={`gradientborders2 relative mb-[2%] flex h-[98px] w-full flex-col items-center justify-center gap-3 rounded-10px border bg-background-shade-2 p-[2px] lg:max-w-[32%]`}
                    key={index}
                  >
                    <h5 className={`text-sm font-semibold text-white`}>
                      {attribute.PropertyName}
                    </h5>
                    <h4 className={`textGradient text-xs font-medium`}>
                      {attribute.Type}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
