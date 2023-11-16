import { GetServerSideProps, NextPage } from "next";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";
import { AddressFactory } from "@/web3/blockchain/providers/address.provider";

const Launchpad: NextPage = () => {
  return null;
};

export default Launchpad;

export const getServerSideProps: GetServerSideProps = async () => {
  // Redirect to Prebooking Page
  return {
    redirect: {
      destination: `/launchpad/${AddressFactory.getContractAddress(
        SmartContractName.DXC
      )}/3`,
      permanent: false,
    },
  };
};
