import "@testing-library/jest-dom";
import { BlockchainConfig } from "../config";
import { SmartContractName } from "../enum/smart.contract.name.enum";
import { AddressFactory } from "../providers/address.provider";

describe("address provider", () => {
  it("should return abi", () => {
    const name = SmartContractName.MARKETPALCE;
    const { abi, address } =
      AddressFactory.getContractInitializationDependencies(name);

    expect(abi).toEqual(BlockchainConfig.abis[name]);
  });

  it("should return address", () => {
    const name = SmartContractName.MARKETPALCE;
    const { abi, address } =
      AddressFactory.getContractInitializationDependencies(name);
    expect(address).toEqual(BlockchainConfig.contracts[name]["5"]);
  });

  it("should return address", () => {
    const name = SmartContractName.MARKETPALCE;
    const address = AddressFactory.getContractAddress(name);
    expect(address).toEqual(BlockchainConfig.contracts[name]["5"]);
  });

  it("should throw error", () => {
    const name = SmartContractName.MARKETPALCE;
    try {
      AddressFactory.getContractAddress("" as any);
    } catch (error: any) {
      expect(error.message).toEqual("invalid contract name");
    }
  });

  it("should throw error", () => {
    const name = SmartContractName.MARKETPALCE;
    try {
      AddressFactory.getContractAddress(null as any);
    } catch (error: any) {
      expect(error.message).toEqual("invalid contract name");
    }
  });

  it("should throw error", () => {
    const name = SmartContractName.MARKETPALCE;
    try {
      AddressFactory.getContractAbi(undefined as any);
    } catch (error: any) {
      expect(error.message).toEqual("invalid contract name");
    }
  });

  it("should return abi", () => {
    const name = SmartContractName.MARKETPALCE;
    const address = AddressFactory.getContractAbi(name);
    expect(address).toEqual(BlockchainConfig.abis[name]);
  });

  it("should throw error", () => {
    const name = SmartContractName.MARKETPALCE;
    try {
      AddressFactory.getContractAbi("" as any);
    } catch (error: any) {
      expect(error.message).toEqual("invalid contract name");
    }
  });

  it("should throw error", () => {
    const name = SmartContractName.MARKETPALCE;
    try {
      AddressFactory.getContractAbi(null as any);
    } catch (error: any) {
      expect(error.message).toEqual("invalid contract name");
    }
  });

  it("should throw error", () => {
    const name = SmartContractName.MARKETPALCE;
    try {
      AddressFactory.getContractAbi(undefined as any);
    } catch (error: any) {
      expect(error.message).toEqual("invalid contract name");
    }
  });

  it("should return network", () => {
    process.env.NEXT_PUBLIC_APP_ENV === "production";
    const network = AddressFactory.getBlockchainNetwork();
    expect(network).toEqual(BlockchainConfig.network);
  });

  it("should return network", () => {
    process.env.NEXT_PUBLIC_APP_ENV === "staging";
    const network = AddressFactory.getBlockchainNetwork();
    expect(network).toEqual(BlockchainConfig.network);
  });
});
