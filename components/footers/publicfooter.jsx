import React from 'react';

const Footer = () => {
  return (
    <div className="bg-gray-shade-3 xl:px-28 lg:px-20 md:px-16 sm:px-4 xl:py-44 lg:py-36 md:py-24 sm:py-10  font-monto  ">
      <div className="xl:container lg:container md:container flex w-full xl:justify-between lg:justify-between md:justify-between sm:justify-start flex-wrap gap-10">
        <div className="flex flex-col text-white gap-10">
          <div className="text-left font-semibold text-xl">Ecosystem</div>
          <div className="flex flex-col gap-6">
            <button className="text-left font-semibold text-sm hover:text-yellow-theme dynamicTrans">
              NFT Marketplace
            </button>
            <button className="text-left font-semibold text-sm hover:text-yellow-theme dynamicTrans">
              Lauchpad
            </button>
          </div>
        </div>
        <div className="flex flex-col text-white gap-10">
          <div className="text-left font-semibold text-xl">About Us</div>
          <div className="flex flex-col gap-6">
            <button className="text-left font-semibold text-sm hover:text-yellow-theme dynamicTrans">
              Audit
            </button>
            <button className="text-left font-semibold text-sm hover:text-yellow-theme dynamicTrans">
              Explore
            </button>
          </div>
        </div>
        <div className="flex flex-col text-white gap-10 ">
          <div className="text-left font-semibold text-xl">Get Notifications</div>
          <div className="flex w-full xl:flex-col lg:flex-col md:flex-row sm:flex-row gap-2">
            <div className="w-full bg-white p-2 rounded-lg text-black">
              <input
                type="email"
                placeholder="Email Address"
                className="outline-none border-none focus:outline-none focus:ring-0 sm:w-full"
              />
            </div>
            {/* <button className="w-full rounded-lg p-4 font-semibold text-black  bg-yellow-theme  dynamicTrans">
            Submit
          </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
