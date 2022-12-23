import NetworkDownlineSkeleton from "@/components/loading.skeletons/network.overview.downline";
import { Genealogy } from "@/models/referral";
import React from "react";
import SingleNetworkDownline from "./single.network.downline";

const NetworkDownline = ({ genealogy }: any) => {
  return (
    <div className="my-12">
      <div className="text-2xl font-semibold mb-6 text-white">
        Network Downline
      </div>
      <div className="w-full flex gap-4 flex-wrap">
        {genealogy ? (
          genealogy.map((item: any, index: number) => {
            return <SingleNetworkDownline data={item} key={index} />;
          })
        ) : (
          <div className=" w-full flex gap-4 flex-wrap">
            <NetworkDownlineSkeleton />
            <NetworkDownlineSkeleton />
            <NetworkDownlineSkeleton />
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkDownline;
