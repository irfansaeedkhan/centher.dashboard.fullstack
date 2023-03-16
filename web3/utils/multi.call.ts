import { ethers } from "ethers";
import { SmartContractName } from "../blockchain/enum/smart.contract.name.enum";
import { SmartContractProvider } from "../blockchain/providers/smart.contract.provider";

export interface Call {
  address: string; // Address of the contract
  name: string; // Function name on the contract (example: balanceOf)
  params?: any[]; // Function params
}

interface MulticallOptions {
  requireSuccess?: boolean;
}

export const multicall = async <T = any>(
  abi: any[],
  calls: Call[]
): Promise<T> => {
  const multi = SmartContractProvider.getContract(SmartContractName.MULTICALL);
  const itf = new ethers.utils.Interface(abi);

  const calldata = calls.map((call) => ({
    target: call.address.toLowerCase(),
    callData: itf.encodeFunctionData(call.name, call.params),
  }));

  const returnData = await multi.aggregate(calldata);

  const res = returnData.map((call: any, i: number) =>
    itf.decodeFunctionResult(calls[i].name, call)
  );

  return res as any;
};
