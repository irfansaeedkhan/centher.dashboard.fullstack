import React, { useState } from "react";
import clsx from "clsx";
import Button from "@/components/button";
import { useGetMyCollections } from "@/hooks/use.get.my.collections";
import { JsonRpcSigner } from "@ethersproject/providers";
import { useWallet } from "@/web3/hooks/use.wallet";
import AuctionForm from "./auction.form";
import FixedPriceForm from "./fixed.price.form";

export interface CreateNFTFormProps {
  createNFT: (values: INFTData) => void;
  clearForm: boolean;
  asset: Blob | undefined;
  library: JsonRpcSigner;
  assetTab: string;
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
  assetTab,
}: CreateNFTFormProps) => {
  const { connectedAddress } = useWallet();
  const collections = useGetMyCollections(connectedAddress);
  const [tab, setTab] = useState("fixed");

  return (
    <div
      className={`relative flex w-full flex-col gap-6 rounded-2xl border border-gray-shade-3 bg-black-shade-9 px-6 py-8`}
    >
      <div className={`flex w-full max-w-[290px] gap-4`}>
        <Button
          title={"fixed Price"}
          variant={tab === "fixed" ? "primary" : "secondary"}
          className={clsx(Tab, tab === "fixed" && activeTab)}
          onClick={() => {
            setTab("fixed");
          }}
        />
        <Button
          title={"Auction"}
          variant={tab === "auction" ? "primary" : "secondary"}
          className={clsx(Tab, tab === "auction" && activeTab)}
          onClick={() => {
            setTab("auction");
          }}
        />
      </div>
      {tab === "fixed" && (
        <FixedPriceForm
          signer={library}
          createNFT={createNFT}
          collections={collections}
          clearForm={clearForm}
          asset={asset}
          assetTab={assetTab}
        />
      )}
      {tab === "auction" && (
        <AuctionForm
          library={library}
          createNFT={createNFT}
          collections={collections}
          clearForm={clearForm}
          asset={asset}
          assetTab={assetTab}
        />
      )}
    </div>
  );
};
// styling

const Tab = `w-full cursor-pointer rounded-[14px]`;
const activeTab = `text-black-shade-3 [&>*>*]:stroke-black-shade-3`;
