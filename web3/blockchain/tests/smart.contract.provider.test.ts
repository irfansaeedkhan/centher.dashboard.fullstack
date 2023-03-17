import "@testing-library/jest-dom";
import { SmartContractProvider } from "../providers/smart.contract.provider";
import { SmartContractName } from "../enum/smart.contract.name.enum";
import { AddressFactory } from "../providers/address.provider";
import { BlockchainConfig } from "../config";

describe("Smart contract provider", () => {
  it('should call "getContractInitializationDependencies" with "MARKETPLACE"', async () => {
    const spy = jest.spyOn(
      AddressFactory,
      "getContractInitializationDependencies"
    );
    const result = SmartContractProvider.getContract(
      SmartContractName.MARKETPALCE
    );

    expect(spy).toBeCalledWith(SmartContractName.MARKETPALCE);
  });

  it('should call "getContractInstance" with abi and address', async () => {
    const name = SmartContractName.MARKETPALCE;
    const spy = jest.spyOn(SmartContractProvider, "getContractInstance");
    const abi = BlockchainConfig.abis[name];
    const address = BlockchainConfig.contracts[name]["5"];
    const result = SmartContractProvider.getContract(name);

    expect(spy).toBeCalledWith(abi, address, undefined);
  });

  it('should call "getContractInstance" and throw error', async () => {
    jest
      .spyOn(SmartContractProvider, "getContractInstance")
      .mockReturnValue(null as any);

    try {
      SmartContractProvider.getContract(SmartContractName.MARKETPALCE);
    } catch (error: any) {
      expect(error.message).toEqual("Invalid smart contract instance");
    }
  });

  it('should call "getNFTContract" and call "getStandardTokenAbi"', async () => {
    const result = jest.spyOn(AddressFactory, "getStandardTokenAbi");
    SmartContractProvider.getNFTContract("test");
    expect(result).toBeCalled();
  });

  it('should call "getContractInstance" and throw error', async () => {
    try {
      SmartContractProvider.getContractInstance(null, "");
    } catch (error: any) {
      expect(error.message).toEqual("Invalid abi or address");
    }
  });
});
