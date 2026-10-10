import React, { useEffect, useState } from "react";

import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";
import { axiosApi369x } from "@/utils/axios/centher-api";
import { customLog } from "@/utils/custom.log";

import NetworkTabs from "../_components/network.tabs";

interface Collection {
  id: string;
  name: string;
  symbol?: string;
}

const AdminMarketplace: NextPageWithLayout = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosApi369x
      .get<{ collections: Collection[] }>("/api/marketplace/collections")
      .then((res) => setCollections(res.data.collections ?? []))
      .catch((e) => {
        customLog(["development", "staging"], "failed to load collections", e);
        setCollections([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base font-semibold text-white f2xl:text-lg ">
        Marketplace
      </h1>
      {loading ? (
        <p className="text-sm text-gray-shade-7">Loading collections...</p>
      ) : collections.length === 0 ? (
        <p className="text-sm text-gray-shade-7">
          No collections listed yet. Collections appear here once created.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-elevation-1">
          <table className="w-full text-left text-sm text-white">
            <thead>
              <tr className="border-b border-gray-shade-3 text-gray-shade-7">
                <th className="px-4 py-3 font-medium">Collection</th>
                <th className="px-4 py-3 font-medium">ID</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-shade-3 last:border-0"
                >
                  <td className="px-4 py-3 font-medium">
                    {c.name}
                    {c.symbol ? ` (${c.symbol})` : ""}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-shade-7">
                    {c.id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

AdminMarketplace.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Admin Metaverse">
      <div className="mx-auto w-full max-w-[1136px]">
        <NetworkTabs />
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default AdminMarketplace;
