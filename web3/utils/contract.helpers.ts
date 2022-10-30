// Addresses
import {
  getNtrdaoAddress,
  getPresaleAddress,
  getBusdAddress,
  getMulticallAddress,
  getRegistrationAddress,
  getRouterAddress,
  getMarketplaceAddress,
} from "./address.helpers";

// ABI
import ntrdaoAbi from "../abis/ntrdao.json";
import presaleAbi from "../abis/presale.json";
import marketplaceAbi from "../abis/marketplace.json";
import registrationAbi from "../abis/registration.json";
import multicallAbi from "../abis/multicall.json";
import busdAbi from "../abis/erc20.json";
import routerAbi from "../abis/router.json";
import ERC721Abi from "../abis/erc721.json"
import { simpleRpcProvider } from "./providers";
import { ethers } from "ethers";
// const getContract = (abi: any, address: string, library: Web3Provider) => {
//   // const signerOrProvider = signer ?? simpleRpcProvider
//   return new Contract(address, abi, library?.getSigner())
// }

type SignerOrProvider = ethers.Signer | ethers.providers.Provider;

const getContract = (abi: any, address: string, signer?: SignerOrProvider) => {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};

// export function getContractWithWeb3(abi: any, address: string, provider: any) {
//   const web3 = new Web3(provider)

//   return new web3.eth.Contract(abi, address)
// }

export const getNtrdaoContract = (signer: any) => {
  return getContract(ntrdaoAbi, getNtrdaoAddress(), signer);
};

export const getRegistrationContract = (signer?: SignerOrProvider) => {
  return getContract(registrationAbi, getRegistrationAddress(), signer);
};

export const getPresaleContract = (signer: any) => {
  return getContract(presaleAbi, getPresaleAddress(), signer);
};

export const getMarketplaceContract = (signer: any) => {
  return getContract(marketplaceAbi, getMarketplaceAddress(), signer);
};

export const getStandardNFTContract = (signer: any, nftAddress: string) => {
  return getContract(ERC721Abi, nftAddress, signer);
};

export const getMulticallContract = (
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  // const contract = getContract(multicallAbi, getMulticallAddress(), signer)
  return getContract(multicallAbi, getMulticallAddress(), signer) as any;
};

// export const getMulticallContract = (signer?: Web3Provider) => {
//   return getContract(multicallAbi, getMulticallAddress(), signer)
// }

export const getRouterContract = (signer: any) => {
  return getContract(routerAbi, getRouterAddress(), signer);
};

export const getBusdContract = (signer: any) => {
  return getContract(busdAbi, getBusdAddress(), signer);
};
