// React, Next, NPM Packages
import React from "react";

import { IProperty } from "./create.nft.form";

interface NFTPropertiesProps {
  attributes: IProperty[] | undefined;
}
export const NFTProperties = (props: NFTPropertiesProps) => {
  return (
    <div className={`w-full`}>
      <div className="accordion" id="accordionExample">
        {props.attributes?.length ? (
          <div className="accordion-item ">
            <h2 className="accordion-header mb-0" id="headingOne">
              <button className={AccordionButton}>Properties</button>
            </h2>
            <div>
              <div className="accordion-body rounded-10px bg-background-shade-3 p-6">
                <div className={`flex flex-wrap gap-[2%]`}>
                  {props.attributes?.length ? (
                    props.attributes.map((attribute, index) => (
                      <div
                        className={`gradientborders2 relative mb-[2%] flex h-[98px] w-full flex-col items-center justify-center gap-3 rounded-10px border border-brand-primary bg-background-shade-2 p-[2px] lg:max-w-[32%]`}
                        key={index}
                      >
                        <h5 className={`text-14px font-semibold text-white`}>
                          {attribute.PropertyName}
                        </h5>
                        <h4 className={`text-12px textGradient font-medium`}>
                          {attribute.Type}
                        </h4>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-lg text-white">
                      {" "}
                      No properties yet!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
// styling

const AccordionButton = `
accordion-button relative flex items-center w-full py-4  text-base text-white text-left !bg-transparent  rounded-none transition focus:outline-none text-14px font-semibold border-b-2 border-gray-shade-3 mb-3
`;
