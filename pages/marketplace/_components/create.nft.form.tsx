// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

// same directory Imports
import FixedPriceForm from "./fixed.price.form";
import { useGetMyCollections } from "@/hooks/use.get.my.collections";
import { useWeb3React } from "@web3-react/core";

export interface CreateNFTFormProps {
  createNFT: any;
  clearForm: boolean;
  asset: Blob | undefined;
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
}: CreateNFTFormProps) => {
  // const [tab, setTab] = useState("Fixed");
  const { account } = useWeb3React();
  const collections = useGetMyCollections(account);

  return (
    <div className={CreateNFTFormContainer}>
      <FixedPriceForm
        createNFT={createNFT}
        collections={collections}
        clearForm={clearForm}
        asset={asset}
      />
    </div>
  );
};
// styling
const CreateNFTFormContainer = ctl(`
 bg-black-shade-9 rounded-2xl relative w-full border   border-gray-shade-3 py-8 px-6 flex flex-col gap-6
`);
