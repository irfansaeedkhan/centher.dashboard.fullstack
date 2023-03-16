import "@testing-library/jest-dom";
import { BlockchainWrite } from "@/web3/blockchain";
import { SmartContractProvider } from "../providers/smart.contract.provider";
import { SmartContractName } from "../enum/smart.contract.name.enum";
import { ethers } from "ethers";
import { normalizeValue } from "../helpers/math.helper";
import { AddressFactory } from "../providers/address.provider";
import { BlockchainConfig } from "../config";

jest.mock("../providers/smart.contract.provider");
jest.mock("../providers/address.provider");

const signer = {
  getSigner: () => {
    return {};
  },
};

describe("BlockchainWrite", () => {
  it('should throw error "Invalid Web3 provider"', async () => {
    try {
      await BlockchainWrite.adminUnPauseRegistration(null as any);
    } catch (error: any) {
      expect(error.message).toEqual("Invalid Web3 provider");
    }
  });

  it('should throw error "Invalid signer"', async () => {
    try {
      const library = {
        getSigner: jest.fn(),
      };
      await BlockchainWrite.adminUnPauseRegistration(library as any);
    } catch (error: any) {
      expect(error.message).toEqual("Invalid signer");
    }
  });

  it('should call "adminUnPauseRegistration" and call smart contract provider with params', async () => {
    const model = {
      unPause: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.adminUnPauseRegistration(signer as any);
    expect(spy).toBeCalledWith(SmartContractName.REGISTRATION, {});
  });

  it('should call "adminUnPauseRegistration" and return "test_hash"', async () => {
    const model = {
      unPause: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.adminUnPauseRegistration(
      signer as any
    );
    expect(result).toEqual(model.unPause().hash);
  });

  it('should call "adminUnPauseRegistration" and throw error', async () => {
    const model = {
      unPause: () => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.adminUnPauseRegistration(
        signer as any
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "adminPauseRegistration" and call smart contract provider with params', async () => {
    const model = {
      pause: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.adminPauseRegistration(signer as any);
    expect(spy).toBeCalledWith(SmartContractName.REGISTRATION, {});
  });

  it('should call "adminPauseRegistration" and return "test_hash"', async () => {
    const model = {
      pause: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.adminPauseRegistration(signer as any);
    expect(result).toEqual(model.pause().hash);
  });

  it('should call "adminPauseRegistration" and throw error', async () => {
    const model = {
      pause: () => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.adminPauseRegistration(
        signer as any
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "adminChangeRegistrationFees" and call smart contract provider with params', async () => {
    const model = {
      changeFees: (
        feeWithReferralLink: number,
        feeWithoutReferralLink: number
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.adminChangeRegistrationFees(signer as any, 0.1, 0.1);
    expect(spy).toBeCalledWith(SmartContractName.REGISTRATION, {});
  });

  it('should call "adminChangeRegistrationFees" and return "test_hash"', async () => {
    const model = {
      changeFees: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.adminChangeRegistrationFees(
      signer as any,
      0.1,
      0.1
    );
    expect(result).toEqual(model.changeFees().hash);
  });

  it('should call "adminChangeRegistrationFees" and call contract with params"', async () => {
    const model = {
      changeFees: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "changeFees");
    await BlockchainWrite.adminChangeRegistrationFees(signer as any, 1, 1);
    const num = ethers.utils.parseEther("1");
    expect(spy).toBeCalledWith(num, num);
  });

  it('should call "adminChangeRegistrationFees" and throw error', async () => {
    const model = {
      changeFees: () => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.adminChangeRegistrationFees(
        signer as any,
        0.1,
        0.1
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "adminChangeReferralRate" and call smart contract provider with params', async () => {
    const model = {
      setReferralRate: (rates: number[]) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.adminChangeReferralRate(signer as any, [1]);
    expect(spy).toBeCalledWith(SmartContractName.PRESALE, {});
  });

  it('should call "adminChangeReferralRate" and return "test_hash"', async () => {
    const model = {
      setReferralRate: (rates: number[]) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.adminChangeReferralRate(
      signer as any,
      [1]
    );
    expect(result).toEqual(model.setReferralRate([1]).hash);
  });

  it('should call "adminChangeReferralRate" and call contract with params"', async () => {
    const model = {
      setReferralRate: (rates: number[]) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "setReferralRate");
    await BlockchainWrite.adminChangeReferralRate(signer as any, [1]);
    expect(spy).toBeCalledWith([1]);
  });

  it('should call "adminChangeReferralRate" and throw error', async () => {
    const model = {
      setReferralRate: (rates: number[]) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.adminChangeReferralRate(
        signer as any,
        [1]
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "adminChangeCompanyAddress" and call smart contract provider with params', async () => {
    const model = {
      changeCompanyAddress: (newAddress: string) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.adminChangeCompanyAddress(
      signer as any,
      "test_address"
    );
    expect(spy).toBeCalledWith(SmartContractName.PRESALE, {});
  });

  it('should call "adminChangeCompanyAddress" and return "test_hash"', async () => {
    const model = {
      changeCompanyAddress: (newAddress: string) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.adminChangeCompanyAddress(
      signer as any,
      "test_address"
    );
    expect(result).toEqual(model.changeCompanyAddress("test_address").hash);
  });

  it('should call "adminChangeCompanyAddress" and call contract with params"', async () => {
    const model = {
      changeCompanyAddress: (newAddress: string) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "changeCompanyAddress");
    await BlockchainWrite.adminChangeCompanyAddress(
      signer as any,
      "test_address"
    );
    expect(spy).toBeCalledWith("test_address");
  });

  it('should call "adminChangeCompanyAddress" and throw error', async () => {
    const model = {
      changeCompanyAddress: (newAddress: string) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.adminChangeCompanyAddress(
        signer as any,
        "test_address"
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "adminChangeCoreTeamAddress" and call smart contract provider with params', async () => {
    const model = {
      changeCoreTeamAddress: (newAddress: string) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.adminChangeCoreTeamAddress(
      signer as any,
      "test_address"
    );
    expect(spy).toBeCalledWith(SmartContractName.PRESALE, {});
  });

  it('should call "adminChangeCoreTeamAddress" and return "test_hash"', async () => {
    const model = {
      changeCoreTeamAddress: (newAddress: string) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.adminChangeCoreTeamAddress(
      signer as any,
      "test_address"
    );
    expect(result).toEqual(model.changeCoreTeamAddress("test_address").hash);
  });

  it('should call "adminChangeCoreTeamAddress" and call contract with params"', async () => {
    const model = {
      changeCoreTeamAddress: (newAddress: string) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "changeCoreTeamAddress");
    await BlockchainWrite.adminChangeCoreTeamAddress(
      signer as any,
      "test_address"
    );
    expect(spy).toBeCalledWith("test_address");
  });

  it('should call "adminChangeCoreTeamAddress" and throw error', async () => {
    const model = {
      changeCoreTeamAddress: (newAddress: string) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.adminChangeCoreTeamAddress(
        signer as any,
        "test_address"
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "adminClaimRegistrationBNB" and call smart contract provider with params', async () => {
    const model = {
      withdraw: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.adminClaimRegistrationBNB(signer as any);
    expect(spy).toBeCalledWith(SmartContractName.REGISTRATION, {});
  });

  it('should call "adminClaimRegistrationBNB" and return "test_hash"', async () => {
    const model = {
      withdraw: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.adminClaimRegistrationBNB(
      signer as any
    );
    expect(result).toEqual(model.withdraw().hash);
  });

  it('should call "adminClaimRegistrationBNB" and throw error', async () => {
    const model = {
      withdraw: () => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.adminClaimRegistrationBNB(
        signer as any
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "adminCallUpdateRoundInfo" and call smart contract provider with params', async () => {
    const model = {
      setRoundInfoForBusd: (
        roundIndex: number,
        centherPriceForBusd: number,
        startTime: number,
        endTime: number,
        lockMonths: number,
        maxCentherAmountToSell: string,
        minBusdAmountPerUser: string,
        maxBusdAmountPerUser: string
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
      setRoundInfoForNtr: (
        roundIndex: number,
        centherPriceForBusd: number,
        startTime: number,
        endTime: number,
        lockMonths: number,
        maxCentherAmountToSell: string,
        minBusdAmountPerUser: string,
        maxBusdAmountPerUser: string
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.adminCallUpdateRoundInfo(
      signer as any,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      true
    );
    expect(spy).toBeCalledWith(SmartContractName.PRESALE, {});
  });

  it('should call "adminCallUpdateRoundInfo" and return "test_hash"', async () => {
    const model = {
      setRoundInfoForBusd: (
        roundIndex: number,
        centherPriceForBusd: number,
        startTime: number,
        endTime: number,
        lockMonths: number,
        maxCentherAmountToSell: string,
        minBusdAmountPerUser: string,
        maxBusdAmountPerUser: string
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
      setRoundInfoForNtr: (
        roundIndex: number,
        centherPriceForBusd: number,
        startTime: number,
        endTime: number,
        lockMonths: number,
        maxCentherAmountToSell: string,
        minBusdAmountPerUser: string,
        maxBusdAmountPerUser: string
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.adminCallUpdateRoundInfo(
      signer as any,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      true
    );
    expect(result).toEqual(
      model.setRoundInfoForBusd(1, 1, 1, 1, 1, "", "", "").hash
    );
  });

  it('should call "adminCallUpdateRoundInfo" and return "test_hash"', async () => {
    const model = {
      setRoundInfoForBusd: (
        roundIndex: number,
        centherPriceForBusd: number,
        startTime: number,
        endTime: number,
        lockMonths: number,
        maxCentherAmountToSell: string,
        minBusdAmountPerUser: string,
        maxBusdAmountPerUser: string
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
      setRoundInfoForNtr: (
        roundIndex: number,
        centherPriceForBusd: number,
        startTime: number,
        endTime: number,
        lockMonths: number,
        maxCentherAmountToSell: string,
        minBusdAmountPerUser: string,
        maxBusdAmountPerUser: string
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.adminCallUpdateRoundInfo(
      signer as any,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      false
    );
    expect(result).toEqual(
      model.setRoundInfoForNtr(1, 1, 1, 1, 1, "", "", "").hash
    );
  });

  it('should call "adminCallUpdateRoundInfo" and call contract with params"', async () => {
    const model = {
      setRoundInfoForBusd: (
        roundIndex: number,
        centherPriceForBusd: number,
        startTime: number,
        endTime: number,
        lockMonths: number,
        maxCentherAmountToSell: string,
        minBusdAmountPerUser: string,
        maxBusdAmountPerUser: string
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
      setRoundInfoForNtr: (
        roundIndex: number,
        centherPriceForBusd: number,
        startTime: number,
        endTime: number,
        lockMonths: number,
        maxCentherAmountToSell: string,
        minBusdAmountPerUser: string,
        maxBusdAmountPerUser: string
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "setRoundInfoForBusd");
    const spyTwo = jest.spyOn(model, "setRoundInfoForNtr");
    await BlockchainWrite.adminCallUpdateRoundInfo(
      signer as any,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      true
    );
    expect(spy).toBeCalledWith(
      1,
      1 * 100000,
      Math.floor(1),
      Math.floor(1),
      1,
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    );
    expect(spyTwo).not.toBeCalled();
  });

  it('should call "adminCallUpdateRoundInfo" and call contract with params"', async () => {
    const model = {
      setRoundInfoForBusd: (
        roundIndex: number,
        centherPriceForBusd: number,
        startTime: number,
        endTime: number,
        lockMonths: number,
        maxCentherAmountToSell: string,
        minBusdAmountPerUser: string,
        maxBusdAmountPerUser: string
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
      setRoundInfoForNtr: (
        roundIndex: number,
        centherPriceForBusd: number,
        startTime: number,
        endTime: number,
        lockMonths: number,
        maxCentherAmountToSell: string,
        minBusdAmountPerUser: string,
        maxBusdAmountPerUser: string
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "setRoundInfoForNtr");
    const spyTwo = jest.spyOn(model, "setRoundInfoForBusd");
    await BlockchainWrite.adminCallUpdateRoundInfo(
      signer as any,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      false
    );
    expect(spy).toBeCalledWith(
      1,
      1 * 100000,
      Math.floor(1),
      Math.floor(1),
      1,
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1")
    );
    expect(spyTwo).not.toBeCalled();
  });

  it('should call "adminCallUpdateRoundInfo" and throw error', async () => {
    const model = {
      setRoundInfoForBusd: (
        roundIndex: number,
        centherPriceForBusd: number,
        startTime: number,
        endTime: number,
        lockMonths: number,
        maxCentherAmountToSell: string,
        minBusdAmountPerUser: string,
        maxBusdAmountPerUser: string
      ) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
      setRoundInfoForNtr: (
        roundIndex: number,
        centherPriceForBusd: number,
        startTime: number,
        endTime: number,
        lockMonths: number,
        maxCentherAmountToSell: string,
        minBusdAmountPerUser: string,
        maxBusdAmountPerUser: string
      ) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error_second");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      await BlockchainWrite.adminCallUpdateRoundInfo(
        signer as any,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        true
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "adminCallUpdateRoundInfo" and throw error', async () => {
    const model = {
      setRoundInfoForBusd: (
        roundIndex: number,
        centherPriceForBusd: number,
        startTime: number,
        endTime: number,
        lockMonths: number,
        maxCentherAmountToSell: string,
        minBusdAmountPerUser: string,
        maxBusdAmountPerUser: string
      ) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
      setRoundInfoForNtr: (
        roundIndex: number,
        centherPriceForBusd: number,
        startTime: number,
        endTime: number,
        lockMonths: number,
        maxCentherAmountToSell: string,
        minBusdAmountPerUser: string,
        maxBusdAmountPerUser: string
      ) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error_second");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      await BlockchainWrite.adminCallUpdateRoundInfo(
        signer as any,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        false
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error_second");
    }
  });

  it('should call "adminCallClaimNtrForCoreTeam" and call smart contract provider with params', async () => {
    const model = {
      withdrawNtrForCoreTeam: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.adminCallClaimNtrForCoreTeam(signer as any);
    expect(spy).toBeCalledWith(SmartContractName.PRESALE, {});
  });

  it('should call "adminCallClaimNtrForCoreTeam" and return "test_hash"', async () => {
    const model = {
      withdrawNtrForCoreTeam: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.adminCallClaimNtrForCoreTeam(
      signer as any
    );
    expect(result).toEqual(model.withdrawNtrForCoreTeam().hash);
  });

  it('should call "adminCallClaimNtrForCoreTeam" and throw error', async () => {
    const model = {
      withdrawNtrForCoreTeam: () => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.adminCallClaimNtrForCoreTeam(
        signer as any
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "adminCallClaimBusdForCoreTeam" and call smart contract provider with params', async () => {
    const model = {
      withdrawBusdForCoreTeam: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.adminCallClaimBusdForCoreTeam(signer as any);
    expect(spy).toBeCalledWith(SmartContractName.PRESALE, {});
  });

  it('should call "adminCallClaimBusdForCoreTeam" and return "test_hash"', async () => {
    const model = {
      withdrawBusdForCoreTeam: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.adminCallClaimBusdForCoreTeam(
      signer as any
    );
    expect(result).toEqual(model.withdrawBusdForCoreTeam().hash);
  });

  it('should call "adminCallClaimBusdForCoreTeam" and throw error', async () => {
    const model = {
      withdrawBusdForCoreTeam: () => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.adminCallClaimBusdForCoreTeam(
        signer as any
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "adminCallClaimNtrForCompany" and call smart contract provider with params', async () => {
    const model = {
      withdrawNtr: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.adminCallClaimNtrForCompany(signer as any);
    expect(spy).toBeCalledWith(SmartContractName.PRESALE, {});
  });

  it('should call "adminCallClaimNtrForCompany" and return "test_hash"', async () => {
    const model = {
      withdrawNtr: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.adminCallClaimNtrForCompany(
      signer as any
    );
    expect(result).toEqual(model.withdrawNtr().hash);
  });

  it('should call "adminCallClaimNtrForCompany" and throw error', async () => {
    const model = {
      withdrawNtr: () => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.adminCallClaimNtrForCompany(
        signer as any
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "adminCallClaimBusdForCompany" and call smart contract provider with params', async () => {
    const model = {
      withdrawBUSD: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.adminCallClaimBusdForCompany(signer as any);
    expect(spy).toBeCalledWith(SmartContractName.PRESALE, {});
  });

  it('should call "adminCallClaimBusdForCompany" and return "test_hash"', async () => {
    const model = {
      withdrawBUSD: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.adminCallClaimBusdForCompany(
      signer as any
    );
    expect(result).toEqual(model.withdrawBUSD().hash);
  });

  it('should call "adminCallClaimBusdForCompany" and throw error', async () => {
    const model = {
      withdrawBUSD: () => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.adminCallClaimBusdForCompany(
        signer as any
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "callCancelAuction" and call smart contract provider with params', async () => {
    const model = {
      cancelAuction: (collection: string, tokenId: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.callCancelAuction(signer as any, "test_address", 1);
    expect(spy).toBeCalledWith(SmartContractName.PRESALE, {});
  });

  it('should call "callCancelAuction" and return "test_hash"', async () => {
    const model = {
      cancelAuction: (collection: string, tokenId: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.callCancelAuction(
      signer as any,
      "test_address",
      1
    );
    expect(result).toEqual(model.cancelAuction("test_address", 1).hash);
  });

  it('should call "callCancelAuction" and call contract with params"', async () => {
    const model = {
      cancelAuction: (collection: string, tokenId: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "cancelAuction");
    await BlockchainWrite.callCancelAuction(signer as any, "test_address", 1);
    expect(spy).toBeCalledWith("test_address", 1);
  });

  it('should call "callCancelAuction" and throw error', async () => {
    const model = {
      cancelAuction: (collection: string, tokenId: number) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.callCancelAuction(
        signer as any,
        "test_address",
        1
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "callEndAuction" and call smart contract provider with params', async () => {
    const model = {
      endAuction: (collection: string, tokenId: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.callEndAuction(signer as any, "test_address", 1);
    expect(spy).toBeCalledWith(SmartContractName.PRESALE, {});
  });

  it('should call "callEndAuction" and return "test_hash"', async () => {
    const model = {
      endAuction: (collection: string, tokenId: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.callEndAuction(
      signer as any,
      "test_address",
      1
    );
    expect(result).toEqual(model.endAuction("test_address", 1).hash);
  });

  it('should call "callEndAuction" and call contract with params"', async () => {
    const model = {
      endAuction: (collection: string, tokenId: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "endAuction");
    await BlockchainWrite.callEndAuction(signer as any, "test_address", 1);
    expect(spy).toBeCalledWith("test_address", 1);
  });

  it('should call "callEndAuction" and throw error', async () => {
    const model = {
      endAuction: (collection: string, tokenId: number) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.callEndAuction(
        signer as any,
        "test_address",
        1
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "callBidOnAuction" and call smart contract provider with params', async () => {
    const model = {
      bidOnAuction: (
        collection: string,
        tokenId: number,
        { value: string }
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.callBidOnAuction(signer as any, "test_address", 1, 1);
    expect(spy).toBeCalledWith(SmartContractName.PRESALE, {});
  });

  it('should call "callBidOnAuction" and return "test_hash"', async () => {
    const model = {
      bidOnAuction: (
        collection: string,
        tokenId: number,
        { value: string }
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.callBidOnAuction(
      signer as any,
      "test_address",
      1,
      1
    );
    expect(result).toEqual(
      model.bidOnAuction("test_address", 1, { value: "1" }).hash
    );
  });

  it('should call "callBidOnAuction" and call contract with params"', async () => {
    const model = {
      bidOnAuction: (
        collection: string,
        tokenId: number,
        { value: string }
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "bidOnAuction");
    await BlockchainWrite.callBidOnAuction(signer as any, "test_address", 1, 1);
    const normalizedValue = ethers.utils.parseEther(normalizeValue(1) + "");
    expect(spy).toBeCalledWith("test_address", 1, { value: normalizedValue });
  });

  it('should call "callBidOnAuction" and throw error', async () => {
    const model = {
      bidOnAuction: (
        collection: string,
        tokenId: number,
        { value: string }
      ) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.callBidOnAuction(
        signer as any,
        "test_address",
        1,
        1
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "callCreateAuction" and call smart contract provider with params', async () => {
    const model = {
      createAuction: (
        collection: string,
        tokenId: number,
        startPrice: number,
        period: number
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.callCreateAuction(
      signer as any,
      "test_address",
      1,
      1,
      5
    );
    expect(spy).toBeCalledWith(SmartContractName.MARKETPALCE, {});
  });

  it('should call "callCreateAuction" and return "test_hash"', async () => {
    const model = {
      createAuction: (
        collection: string,
        tokenId: number,
        startPrice: number,
        period: number
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.callCreateAuction(
      signer as any,
      "test_address",
      1,
      1,
      5
    );
    expect(result).toEqual(model.createAuction("test_address", 1, 1, 5).hash);
  });

  it('should call "callCreateAuction" and call contract with params"', async () => {
    const model = {
      createAuction: (
        collection: string,
        tokenId: number,
        startPrice: number,
        period: number
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "createAuction");
    await BlockchainWrite.callCreateAuction(
      signer as any,
      "test_address",
      1,
      1,
      5
    );
    const normalizedValue = ethers.utils.parseEther(normalizeValue(1) + "");
    expect(spy).toBeCalledWith("test_address", 1, normalizedValue, 5);
  });

  it('should call "callCreateAuction" and throw error', async () => {
    const model = {
      createAuction: (
        collection: string,
        tokenId: number,
        startPrice: number,
        period: number
      ) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.callCreateAuction(
        signer as any,
        "test_address",
        1,
        1,
        5
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "callBuyListedItem" and call smart contract provider with params', async () => {
    const model = {
      buyForListedItem: (
        collection: string,
        tokenId: number,
        { value: string }
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.callBuyListedItem(
      signer as any,
      "test_address",
      1,
      1
    );
    expect(spy).toBeCalledWith(SmartContractName.MARKETPALCE, {});
  });

  it('should call "callBuyListedItem" and return "test_hash"', async () => {
    const model = {
      buyForListedItem: (
        collection: string,
        tokenId: number,
        { value: string }
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.callBuyListedItem(
      signer as any,
      "test_address",
      1,
      1
    );
    expect(result).toEqual(
      model.buyForListedItem("test_address", 1, { value: 1 }).hash
    );
  });

  it('should call "callBuyListedItem" and call contract with params"', async () => {
    const model = {
      buyForListedItem: (
        collection: string,
        tokenId: number,
        { value: string }
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "buyForListedItem");
    await BlockchainWrite.callBuyListedItem(
      signer as any,
      "test_address",
      1,
      1
    );
    const normalizedValue = ethers.utils.parseEther(normalizeValue(1) + "");
    expect(spy).toBeCalledWith("test_address", 1, { value: normalizedValue });
  });

  it('should call "callBuyListedItem" and throw error', async () => {
    const model = {
      buyForListedItem: (
        collection: string,
        tokenId: number,
        { value: string }
      ) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.callBuyListedItem(
        signer as any,
        "test_address",
        1,
        1,
        5
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "callListItemForSale" and call smart contract provider with params', async () => {
    const model = {
      listItemForSale: (
        collection: string,
        tokenId: number,
        newPrice: string
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.callListItemForSale(
      signer as any,
      "test_address",
      1,
      1
    );
    expect(spy).toBeCalledWith(SmartContractName.MARKETPALCE, {});
  });

  it('should call "callListItemForSale" and return "test_hash"', async () => {
    const model = {
      listItemForSale: (
        collection: string,
        tokenId: number,
        newPrice: string
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.callListItemForSale(
      signer as any,
      "test_address",
      1,
      1
    );
    expect(result).toEqual(model.listItemForSale("test_address", 1, "1").hash);
  });

  it('should call "callListItemForSale" and call contract with params"', async () => {
    const model = {
      listItemForSale: (
        collection: string,
        tokenId: number,
        newPrice: string
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "listItemForSale");
    await BlockchainWrite.callListItemForSale(
      signer as any,
      "test_address",
      1,
      1
    );
    const normalizedValue = ethers.utils.parseEther(normalizeValue(1) + "");
    expect(spy).toBeCalledWith("test_address", 1, normalizedValue);
  });

  it('should call "callListItemForSale" and throw error', async () => {
    const model = {
      listItemForSale: (
        collection: string,
        tokenId: number,
        newPrice: string
      ) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.callListItemForSale(
        signer as any,
        "test_address",
        1,
        1
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "callEditItemForSale" and call smart contract provider with params', async () => {
    const model = {
      editItemForSale: (
        collection: string,
        tokenId: number,
        newPrice: string
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.callEditItemForSale(
      signer as any,
      "test_address",
      1,
      1
    );
    expect(spy).toBeCalledWith(SmartContractName.MARKETPALCE, {});
  });

  it('should call "callEditItemForSale" and return "test_hash"', async () => {
    const model = {
      editItemForSale: (
        collection: string,
        tokenId: number,
        newPrice: string
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.callEditItemForSale(
      signer as any,
      "test_address",
      1,
      1
    );
    expect(result).toEqual(model.editItemForSale("test_address", 1, "1").hash);
  });

  it('should call "callEditItemForSale" and call contract with params"', async () => {
    const model = {
      editItemForSale: (
        collection: string,
        tokenId: number,
        newPrice: string
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "editItemForSale");
    await BlockchainWrite.callEditItemForSale(
      signer as any,
      "test_address",
      1,
      1
    );
    const normalizedValue = ethers.utils.parseEther(normalizeValue(1) + "");
    expect(spy).toBeCalledWith("test_address", 1, normalizedValue);
  });

  it('should call "callEditItemForSale" and throw error', async () => {
    const model = {
      editItemForSale: (
        collection: string,
        tokenId: number,
        newPrice: string
      ) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.callEditItemForSale(
        signer as any,
        "test_address",
        1,
        1
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "callCancelItemForSale" and call smart contract provider with params', async () => {
    const model = {
      cancelItemForSale: (collection: string, tokenId: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.callCancelItemForSale(
      signer as any,
      "test_address",
      1
    );
    expect(spy).toBeCalledWith(SmartContractName.MARKETPALCE, {});
  });

  it('should call "callCancelItemForSale" and return "test_hash"', async () => {
    const model = {
      cancelItemForSale: (collection: string, tokenId: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.callCancelItemForSale(
      signer as any,
      "test_address",
      1
    );
    expect(result).toEqual(model.cancelItemForSale("test_address", 1).hash);
  });

  it('should call "callCancelItemForSale" and call contract with params"', async () => {
    const model = {
      cancelItemForSale: (collection: string, tokenId: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "cancelItemForSale");
    await BlockchainWrite.callCancelItemForSale(
      signer as any,
      "test_address",
      1
    );
    expect(spy).toBeCalledWith("test_address", 1);
  });

  it('should call "callCancelItemForSale" and throw error', async () => {
    const model = {
      cancelItemForSale: (collection: string, tokenId: number) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.callCancelItemForSale(
        signer as any,
        "test_address",
        1
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "callCreateNFT" and call smart contract provider with params', async () => {
    const model = {
      createItems: (
        collection: string,
        tokenUri: string,
        supply: number,
        isAuction: boolean,
        price: string,
        period: number,
        { value: string }
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.callCreateNFT(
      signer as any,
      "test",
      "test",
      1,
      true,
      1,
      1,
      1
    );
    expect(spy).toBeCalledWith(SmartContractName.MARKETPALCE, {});
  });

  it('should call "callCreateNFT" and return "test_hash"', async () => {
    const model = {
      createItems: (
        collection: string,
        tokenUri: string,
        supply: number,
        isAuction: boolean,
        price: string,
        period: number,
        { value: string }
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.callCreateNFT(
      signer as any,
      "test",
      "test",
      1,
      true,
      1,
      1,
      1
    );
    expect(result).toEqual(
      model.createItems("test_address", "", 1, true, "", 1, { value: "" }).hash
    );
  });

  it('should call "callCreateNFT" and call contract with params"', async () => {
    const model = {
      createItems: (
        collection: string,
        tokenUri: string,
        supply: number,
        isAuction: boolean,
        price: string,
        period: number,
        { value: string }
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "createItems");
    await BlockchainWrite.callCreateNFT(
      signer as any,
      "test",
      "test",
      1,
      true,
      1,
      1,
      1
    );
    const normalizedValue = ethers.utils.parseEther(normalizeValue(1) + "");
    const fee = 1;
    const castedFee = ethers.utils.parseEther(fee.toFixed(10));
    expect(spy).toBeCalledWith("test", "test", 1, true, normalizedValue, 1, {
      value: castedFee,
    });
  });

  it('should call "callCreateNFT" and throw error', async () => {
    const model = {
      createItems: (
        collection: string,
        tokenUri: string,
        supply: number,
        isAuction: boolean,
        price: string,
        period: number,
        { value: string }
      ) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.callCreateNFT(
        signer as any,
        "test",
        "test",
        1,
        true,
        1,
        1,
        1
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "callCreateCollection" and call smart contract provider with params', async () => {
    const model = {
      createCollection: (
        name: string,
        symbol: string,
        category: string,
        uri: string,
        maxsupply: number,
        { value: string }
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.callCreateCollection(
      signer as any,
      "test",
      "test",
      "test",
      "test",
      1,
      1
    );
    expect(spy).toBeCalledWith(SmartContractName.MARKETPALCE, {});
  });

  it('should call "callCreateCollection" and return "test_hash"', async () => {
    const model = {
      createCollection: (
        name: string,
        symbol: string,
        category: string,
        uri: string,
        maxsupply: number,
        { value: string }
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.callCreateCollection(
      signer as any,
      "test",
      "test",
      "test",
      "test",
      1,
      1
    );
    expect(result).toEqual(
      model.createCollection("test_address", "", "", "", 1, { value: "" }).hash
    );
  });

  it('should call "callCreateCollection" and call contract with params"', async () => {
    const model = {
      createCollection: (
        name: string,
        symbol: string,
        category: string,
        uri: string,
        maxsupply: number,
        { value: string }
      ) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "createCollection");
    await BlockchainWrite.callCreateCollection(
      signer as any,
      "test",
      "test",
      "test",
      "test",
      1,
      1
    );
    const fee = 1;
    const castedFee = ethers.utils.parseEther(fee.toFixed(10));
    expect(spy).toBeCalledWith("test", "test", "test", "test", 1, {
      value: castedFee,
    });
  });

  it('should call "callCreateCollection" and throw error', async () => {
    const model = {
      createCollection: (
        name: string,
        symbol: string,
        category: string,
        uri: string,
        maxsupply: number,
        { value: string }
      ) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getNFTContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.callCreateCollection(
        signer as any,
        "test",
        "test",
        "test",
        "test",
        1,
        1
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "callApproveNFTToMarketplace" and call smart contract provider with params', async () => {
    const model = {
      setApprovalForAll: (operator: string, access: boolean) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(AddressFactory, "getContractAddress")
      .mockReturnValue("test-contract-address");

    const spy = jest
      .spyOn(SmartContractProvider, "getNFTContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.callApproveNFTToMarketplace(
      signer as any,
      "test_address"
    );
    expect(spy).toBeCalledWith("test_address", {});
  });

  it('should call "callApproveNFTToMarketplace" and return "test_hash"', async () => {
    const model = {
      setApprovalForAll: (operator: string, access: boolean) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(AddressFactory, "getContractAddress")
      .mockReturnValue("test-contract-address");

    jest
      .spyOn(SmartContractProvider, "getNFTContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.callApproveNFTToMarketplace(
      signer as any,
      "test_address"
    );
    expect(result).toEqual(model.setApprovalForAll("test_address", true).hash);
  });

  it('should call "callApproveNFTToMarketplace" and call contract with params"', async () => {
    const model = {
      setApprovalForAll: (operator: string, access: boolean) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(AddressFactory, "getContractAddress")
      .mockReturnValue("test-contract-address");

    jest
      .spyOn(SmartContractProvider, "getNFTContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "setApprovalForAll");
    await BlockchainWrite.callApproveNFTToMarketplace(
      signer as any,
      "test_address"
    );

    expect(spy).toBeCalledWith("test-contract-address", true);
  });

  it('should call "callApproveNFTToMarketplace" and throw error', async () => {
    const model = {
      setApprovalForAll: (operator: string, access: boolean) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(AddressFactory, "getContractAddress")
      .mockReturnValue("test-contract-address");

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.callApproveNFTToMarketplace(
        signer as any,
        "test_address",
        1,
        1
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "callClaimNTRForReferral" and call smart contract provider with params', async () => {
    const model = {
      claimRefRewardNTR: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.callClaimNTRForReferral(signer as any);
    expect(spy).toBeCalledWith(SmartContractName.PRESALE, {});
  });

  it('should call "callClaimNTRForReferral" and return "test_hash"', async () => {
    const model = {
      claimRefRewardNTR: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.callClaimNTRForReferral(signer as any);
    expect(result).toEqual(model.claimRefRewardNTR().hash);
  });

  it('should call "callClaimNTRForReferral" and throw error', async () => {
    const model = {
      claimRefRewardNTR: () => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.callClaimNTRForReferral(
        signer as any
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "callClaimBUSDForReferral" and call smart contract provider with params', async () => {
    const model = {
      claimRefRewardBUSD: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.callClaimBUSDForReferral(signer as any);
    expect(spy).toBeCalledWith(SmartContractName.PRESALE, {});
  });

  it('should call "callClaimBUSDForReferral" and return "test_hash"', async () => {
    const model = {
      claimRefRewardBUSD: () => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.callClaimBUSDForReferral(
      signer as any
    );
    expect(result).toEqual(model.claimRefRewardBUSD().hash);
  });

  it('should call "callClaimBUSDForReferral" and throw error', async () => {
    const model = {
      claimRefRewardBUSD: () => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.callClaimBUSDForReferral(
        signer as any
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "claimNtrTokens" and call smart contract provider with params', async () => {
    const model = {
      claimTokensFromBusd: (round: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
      claimTokensFromNtr: (round: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.claimNtrTokens(signer as any, 1, "BUSD");
    expect(spy).toBeCalledWith(SmartContractName.PRESALE, {});
  });

  it('should call "claimNtrTokens" and return "test_hash"', async () => {
    const model = {
      claimTokensFromBusd: (round: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
      claimTokensFromNtr: (round: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.claimNtrTokens(
      signer as any,
      1,
      "BUSD"
    );
    expect(result).toEqual(model.claimTokensFromBusd(1).hash);
  });

  it('should call "claimNtrTokens" and call contract with params"', async () => {
    const model = {
      claimTokensFromBusd: (round: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
      claimTokensFromNtr: (round: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "claimTokensFromBusd");
    await BlockchainWrite.claimNtrTokens(signer as any, 1, "BUSD");
    expect(spy).toBeCalledWith(1);
  });

  it('should call "claimNtrTokens" and throw error', async () => {
    const model = {
      claimTokensFromBusd: (round: number) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
      claimTokensFromNtr: (round: number) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.claimNtrTokens(
        signer as any,
        1,
        "BUSD"
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });

  it('should call "buyCenther" and call smart contract provider with params', async () => {
    const model = {
      tokenPurchaseWithBUSD: (amount: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
      tokenPurchaseWithNtr: (amount: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.buyCenther("BUSD", 1, signer as any);
    expect(spy).toBeCalledWith(SmartContractName.PRESALE, {});
  });

  it('should call "buyCenther" and return "test_hash"', async () => {
    const model = {
      tokenPurchaseWithBUSD: (round: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
      tokenPurchaseWithNtr: (round: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.buyCenther("BUSD", 1, signer as any);
    expect(result).toEqual(model.tokenPurchaseWithBUSD(1).hash);
  });

  it('should call "buyCenther" and call contract with params"', async () => {
    const model = {
      tokenPurchaseWithBUSD: (amount: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
      tokenPurchaseWithNtr: (amount: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "tokenPurchaseWithBUSD");
    const amount = 1;
    const purchaseAmount = ethers.utils.parseUnits(amount.toString(), 18);
    await BlockchainWrite.buyCenther("BUSD", amount, signer as any);
    expect(spy).toBeCalledWith(purchaseAmount);
  });

  it('should call "buyCenther" and call contract with params"', async () => {
    const model = {
      tokenPurchaseWithBUSD: (amount: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
      tokenPurchaseWithNtr: (amount: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "tokenPurchaseWithNtr");
    const amount = 1;
    await BlockchainWrite.buyCenther("NTR", amount, signer as any);
    const purchaseAmount = ethers.utils.parseUnits(amount.toString(), 18);
    expect(spy).toBeCalledWith(purchaseAmount);
  });

  it('should call "buyCenther" and throw error', async () => {
    const model = {
      tokenPurchaseWithBUSD: (amount: number) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error_busd");
          },
        };
      },
      tokenPurchaseWithNtr: (amount: number) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error_ntr");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.buyCenther("BUSD", 1, signer as any);
    } catch (error: any) {
      expect(error.message).toEqual("test_error_busd");
    }
  });

  it('should call "buyCenther" and throw error', async () => {
    const model = {
      tokenPurchaseWithBUSD: (amount: number) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error_busd");
          },
        };
      },
      tokenPurchaseWithNtr: (amount: number) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error_ntr");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.buyCenther("NTR", 1, signer as any);
    } catch (error: any) {
      expect(error.message).toEqual("test_error_ntr");
    }
  });

  it('should call "getTokenApproval" and call smart contract provider with params', async () => {
    const model = {
      approve: (address: string, round: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getTokenContract")
      .mockReturnValue(contract as any);
    await BlockchainWrite.getTokenApproval("BUSD", signer as any);
    expect(spy).toBeCalledWith("BUSD", {});
  });

  it('should call "getTokenApproval" and call smart contract provider with params', async () => {
    const model = {
      approve: (address: string, round: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const spy = jest
      .spyOn(SmartContractProvider, "getTokenContract")
      .mockReturnValue(contract as any);
    try {
      await BlockchainWrite.getTokenApproval("ETH" as any, signer as any);
    } catch (error: any) {
      expect(error.message).toEqual("Token contract not found");
    }
  });

  it('should call "getTokenApproval" and return "test_hash"', async () => {
    const model = {
      approve: (address: string, round: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getTokenContract")
      .mockReturnValue(contract as any);
    const result = await BlockchainWrite.getTokenApproval(
      "BUSD",
      signer as any
    );
    expect(result).toEqual(model.approve("", 1).hash);
  });

  it('should call "getTokenApproval" and call contract with params"', async () => {
    const model = {
      approve: (address: string, round: number) => {
        return {
          hash: "test_hash",
          wait: jest.fn(),
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    const amount = ethers.utils.parseUnits(
      BlockchainConfig.maxSupply.toString()
    );

    jest
      .spyOn(SmartContractProvider, "getTokenContract")
      .mockReturnValue(contract as any);
    const spy = jest.spyOn(model, "approve");
    await BlockchainWrite.getTokenApproval("BUSD", signer as any);
    expect(spy).toBeCalledWith("test-contract-address", amount);
  });

  it('should call "getTokenApproval" and throw error', async () => {
    const model = {
      approve: (address: string, round: number) => {
        return {
          hash: "test_hash",
          wait: () => {
            throw new Error("test_error");
          },
        };
      },
    };

    const contract = {
      callStatic: model,
      functions: model,
    };

    jest
      .spyOn(SmartContractProvider, "getTokenContract")
      .mockReturnValue(contract as any);
    try {
      const result = await BlockchainWrite.getTokenApproval(
        "BUSD",
        signer as any
      );
    } catch (error: any) {
      expect(error.message).toEqual("test_error");
    }
  });
});
