// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

export const NFTProperties = () => {
  return (
    <div className={NFTPropertiesContainer}>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item bg-transparent ">
          <h2 className="accordion-header mb-0" id="headingOne">
            <button
              className={AccordionButton}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#propertiesComponent"
              aria-expanded="true"
              aria-controls="propertiesComponent"
            >
              Properties
            </button>
          </h2>
          <div
            id="propertiesComponent"
            className={AccordionCollapse}
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body p-6">
              <div className={propetiesListContainer}>
                <div className={properyCard}>
                  <h4 className={PropertyName}>Artist</h4>
                  <h5 className={Type}>Reo Cragun</h5>
                  <h6 className={percentage}>100% have this trail</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// styling
const NFTPropertiesContainer = ctl(`
w-full 
`);
const AccordionButton = ctl(`
accordion-button relative flex items-center w-full py-4 px-5 text-base text-white text-left !bg-transparent  rounded-none transition focus:outline-none text-14px font-semibold border-b-2 border-gray-shade-3 mb-3
`);
const AccordionCollapse = ctl(`
accordion-collapse collapse show bg-background-shade-3 rounded-10px
`);
const propetiesListContainer = ctl(`
flex flex-wrap gap-[2%]
`);
const properyCard = ctl(`
border border-yellow-theme rounded-10px flex flex-col items-center justify-center py-4  gap-3 bg-background-shade-2 w-full lg:max-w-[32%] mb-[2%] relative
`);
const PropertyName = ctl(`
text-12px font-medium text-yellow-theme
`);
const Type = ctl(`
text-14px font-semibold text-white
`);
const percentage = ctl(`
text-12px font-medium text-gray-shade-7
`);
