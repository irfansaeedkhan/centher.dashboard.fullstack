import React from "react";
import { NextPageWithLayout } from "@/pages/_app.page";
import AdminHeader from "@/components/header/admin.header";
import { AdminSidebar } from "@/components/sidebar/admin.sidebar";

const CreateStakingPack: NextPageWithLayout = () => {
  return (
    <div className="min-h-screen flex-grow bg-black-shade-3 p-4 font-monto">
      <div className="mx-auto mt-11 max-w-[720px] rounded-[10px] bg-background-shade-1 text-white">
        <h1 className="pl-10 pt-10 text-2xl">Create New Coin Pack</h1>
        <form className="mx-auto max-w-[496px] py-10">
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
                className="placeholder:textGradient mt-2 block w-full rounded-[10px] border-0 bg-white bg-opacity-5 px-4 py-3 focus:outline-none focus:ring-brand-primary"
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
              <select className="mt-2 block w-full rounded-[10px] border-0 bg-white bg-opacity-5 px-4 py-3 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary">
                <option className="bg-black text-white">Active</option>
                <option className="bg-black text-white">Disable</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <button className="text-12 w-full rounded-[10px] bg-brand-primary px-4 py-3 font-bold text-black">
              Create New
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

CreateStakingPack.getLayout = (page) => {
  return (
    <>
      <AdminHeader title="Create New Coin Pack" />
      <div className="flex">
        <AdminSidebar />
        {page}
      </div>
    </>
  );
};

const formLabel = `block`;
const formDivider = `flex gap-x-3 mt-3`;
const formField = `bg-white bg-opacity-5 block w-full placeholder:text-gray-shade-17 border-0 focus:ring-brand-primary focus:outline-none rounded-[10px] py-3 px-4 mt-2`;

export default CreateStakingPack;
