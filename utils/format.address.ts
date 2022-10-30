import { ethers } from "ethers"

export const formatAddress = (address: string | undefined) => {
  return address && address.length >= 6 ? `${address.substring(0,6)}...${address.substring(address.length-6,address.length)}` : ""
}

export const formatEther2Number = (num: number | undefined) => {
  return Number(num? ethers.utils.formatEther(num) : 0)
}

export const formatString2Ether = (num: string | undefined) => {
  return Number(num? ethers.utils.formatEther(num) : 0)
}

export const formatBNB2USD = (bnb: number | undefined) => {
  return bnb? formatEther2Number(bnb) * 300 : 0
}