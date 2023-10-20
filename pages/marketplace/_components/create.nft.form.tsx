// React, Next, NPM Packages
import React, { useState } from "react";

// App imports
import Button from "@/components/button";
import { useGetMyCollections } from "@/hooks/use.get.my.collections";

// same directory Imports
import FixedPriceForm from "./fixed.price.form";
import AuctionForm from "./auction.form";
import { JsonRpcSigner } from "@ethersproject/providers";
import { useWallet } from "@/web3/hooks/use.wallet";

export interface CreateNFTFormProps {
  createNFT: any;
  clearForm: boolean;
  asset: Blob | undefined;
  library: JsonRpcSigner;
}
export interface IProperty {
  Type: string;
  PropertyName: string;
}
export interface INFTData {
  name: string;
  description: string;
  supply: number;
  isAuction: boolean;
  price: number;
  period: number;
  collection: string;
  properties: IProperty[];
}
export const CreateNFTForm = ({
  createNFT,
  clearForm,
  asset,
  library,
}: CreateNFTFormProps) => {
  const [tab, setTab] = useState("Fixed");
  const { connectedAddress } = useWallet();
  const collections = useGetMyCollections(connectedAddress);

  return (
    <div
      className={`relative flex w-full flex-col gap-6 rounded-2xl border border-gray-shade-3 bg-black-shade-9 px-6 py-8`}
    >
      <div className={`flex w-full max-w-[290px] gap-4`}>
        <Button
          title={"Fixed Price"}
          variant={tab === "Fixed" ? "primary" : "secondary"}
          onClick={() => {
            setTab("Fixed");
          }}
          className={`${Tab} ${tab === "Fixed" && activeTab}`}
        />
        <Button
          title={"Auction"}
          variant={tab === "Auction" ? "primary" : "secondary"}
          onClick={() => {
            setTab("Auction");
          }}
          className={`${Tab} ${tab === "Auction" && activeTab}`}
        />
      </div>
      {tab === "Fixed" && (
        <FixedPriceForm
          signer={library}
          createNFT={createNFT}
          collections={collections}
          clearForm={clearForm}
          asset={asset}
        />
      )}
      {tab === "Auction" && (
        <AuctionForm
          library={library}
          createNFT={createNFT}
          collections={collections}
          clearForm={clearForm}
          asset={asset}
        />
      )}
    </div>
  );
};
// styling

const Tab = `w-full cursor-pointer rounded-[14px]`;
const activeTab = `text-black-shade-3 [&>*>*]:stroke-black-shade-3`;
