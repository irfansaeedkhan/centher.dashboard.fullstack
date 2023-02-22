import NetworkDownlineSkeleton from "@/components/loading.skeletons/network.overview.downline";
import { Genealogy } from "@/models/referral";
import React from "react";
import SingleNetworkDownline from "./single.network.downline";

const NetworkDownline = ({ genealogy }: any) => {
  return (
    <div className="my-12">
      <div className="mb-6 text-2xl font-semibold text-white">
        Network Downline
      </div>
      <div className="flex w-full flex-wrap gap-4">
        {genealogy ? (
          genealogy.map((item: any, index: number) => {
            return <SingleNetworkDownline data={item} key={index} />;
          })
        ) : (
          <div className=" flex w-full flex-wrap gap-4">
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
