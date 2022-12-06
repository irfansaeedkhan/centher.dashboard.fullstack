import React from "react";
import SingleNetworkDownline from "./single.network.downline";

const NetworkDownline = () => {
  return (
    <div className="my-12">
      <div className="text-2xl font-semibold mb-6 text-white">
        Network Downline
      </div>
      <div className="bg-elevation-1 rounded-[14px]">
        <SingleNetworkDownline />
        <SingleNetworkDownline />
      </div>
    </div>
  );
};

export default NetworkDownline;
