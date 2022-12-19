import React from "react";
import SingleNetworkDownline from "./single.network.downline";

const NetworkDownline = () => {
  return (
    <div className="my-12">
      <div className="text-2xl font-semibold mb-6 text-white">
        Network Downline
      </div>
      <div className="w-full flex gap-4 flex-wrap">
        <SingleNetworkDownline />
        <SingleNetworkDownline />
        <SingleNetworkDownline />
        <SingleNetworkDownline />
        <SingleNetworkDownline />
        <SingleNetworkDownline />
        <SingleNetworkDownline />
        <SingleNetworkDownline />
        <SingleNetworkDownline />
        <SingleNetworkDownline />
        <SingleNetworkDownline />
      </div>
    </div>
  );
};

export default NetworkDownline;
