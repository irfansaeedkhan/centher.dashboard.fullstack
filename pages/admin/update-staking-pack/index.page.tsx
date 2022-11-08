// React, Next, NPM Packages
import React from "react";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import AdminHeader from "@/components/header/admin.header";
import { AdminSidebar } from "@/components/sidebar/admin.sidebar";

const UpdateStakingPack: NextPageWithLayout = () => {
  return (
    <div className={`bg-black-shade-3 min-h-screen flex-grow p-4 font-monto`}>
      <div
        className={`bg-background-shade-1 text-white max-w-[720px] mx-auto mt-11 rounded-[10px]`}
      >
        <h1 className={`text-[24px] pt-10 pl-10`}>Update New Coin Pack</h1>
        <form className={`py-10 mx-auto max-w-[496px]`}>
          <label className={formLabel}>Name</label>
          <input
            type="text"
            className={formField}
            placeholder="Name your coin pack here"
          />
          <div className={formDivider}>
            <div>
              <label className={formLabel}>Price</label>
              <input type="text" placeholder="00" className={formField} />
            </div>
            <div>
              <label className={formLabel}>Currency</label>
              <input
                type="text"
                disabled
                className={`bg-white bg-opacity-5 w-full block rounded-[10px] placeholder:textGradient border-0 focus:ring-brand-primary focus:outline-none py-3 px-4 mt-2`}
                placeholder="NTR"
              />
            </div>
          </div>

          <div className={formDivider}>
            <div>
              <label className={formLabel}>Daily Profit</label>
              <input type="text" placeholder="00" className={formField} />
            </div>
            <div>
              <label className={formLabel}>Duration</label>
              <input type="text" className={formField} placeholder="Lifetime" />
            </div>
          </div>

          <div className={formDivider}>
            <div className="w-full">
              <label className={formLabel}>Claim Lookup</label>
              <input type="text" placeholder="00" className={formField} />
            </div>
            <div className="w-full">
              <label className={formLabel}>Status</label>
              {/* <input type="text" className={formField} /> */}
              <select className="bg-white bg-opacity-5 block w-full placeholder:text-gray-shade-17 border-0 focus:ring-brand-primary focus:outline-none rounded-[10px] py-3 px-4 mt-2">
                <option className="bg-black text-white">Active</option>
                <option className="bg-black text-white">Disable</option>
              </select>
            </div>
          </div>
          <div className={`mt-6`}>
            <button
              className={`bg-brand-primary w-full py-3 px-4 text-black rounded-[10px] text-12 font-bold`}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

UpdateStakingPack.getLayout = (page) => {
  return (
    <>
      <AdminHeader title="Update New Coin Pack" />
      <div className="flex">
        <AdminSidebar />
        {page}
      </div>
    </>
  );
};

export default UpdateStakingPack;

const formLabel = `block`;

const formField = `bg-white bg-opacity-5 block w-full placeholder:text-gray-shade-17 border-0 focus:ring-brand-primary focus:outline-none rounded-[10px] py-3 px-4 mt-2`;
const formDivider = `flex gap-x-3 mt-3`;
