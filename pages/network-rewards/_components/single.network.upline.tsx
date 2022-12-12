import React from "react";

const SingleNetworkUpline = () => {
  return (
    <div className="w-full mt-4">
      <div className="bg-elevation-2 p-8 flex justify-between items-center text-gray-shade-7 text-sm font-semibold rounded-t-[14px]">
        <p>Public Key</p>
        <p>User level</p>
      </div>
      <div className="bg-elevation-1 p-8 flex justify-between items-center text-sm font-semibold rounded-b-[14px]">
        <p className="text-white truncate w-full fmd:max-w-[400px]  max-w-[150px]">
          0x13C22acbb80d9e8ACfe5cdFEb7B3f4F56a92F88f
        </p>
        <p className="animationTextHeading !text-sm !font-semibold w-fit">
          Level 1
        </p>
      </div>
    </div>
  );
};

export default SingleNetworkUpline;
