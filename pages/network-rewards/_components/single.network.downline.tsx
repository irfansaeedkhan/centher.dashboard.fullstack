import React from "react";

const SingleNetworkDownline = () => {
  return (
    <div className="flex flex-wrap border-b border-black-shade-7 w-full">
      <div className="w-full md:max-w-[50%] max-w-[100%] flex">
        <div className="w-full max-w-[50%] font-semibold py-12 px-8">
          <p className="text-sm text-gray-shade-3">FIRST LEVEL</p>
          <p className="text-white text-2xl mt-5">1</p>
        </div>
        <div className="w-full max-w-[50%] font-semibold py-12 px-8">
          <p className="text-sm text-gray-shade-3">SECOND LEVEL</p>
          <p className="text-white text-2xl mt-5">1</p>
        </div>
      </div>
      <div className="w-full md:max-w-[50%] max-w-[100%]  flex">
        <div className="w-full max-w-[50%] font-semibold py-12 px-8">
          <p className="text-sm text-gray-shade-3">THIRD LEVEL</p>
          <p className="text-white text-2xl mt-5">1</p>
        </div>
        <div className="w-full max-w-[50%] font-semibold py-12 px-8">
          <p className="text-sm text-gray-shade-3">FOURTH LEVEL</p>
          <p className="text-white text-2xl mt-5">1</p>
        </div>
      </div>
    </div>
  );
};

export default SingleNetworkDownline;
