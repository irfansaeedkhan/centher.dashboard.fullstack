import { Reward } from "@/lib/get-pre-bookings-stats/types";
import { BlockchainRead } from "@/web3/blockchain";
import { formatEther, parseEther } from "ethers/lib/utils";

export interface PurchaseHistory {
  trx_hash: string;
  sender_address: string;
  payment_token_amount: string;
  payment_token_name: string;
  payment_token_symbol: string;
  round: string;
  roundPrice: string;
  amountInBusd: string;
  receivable_token_amount: string;
  receivable_token_name: string;
  receivable_token_symbol: string;
  createdAt: number;
}

export type RewardBlockchain = Pick<
  Reward,
  | "id"
  | "sender_address"
  | "reward_token_name"
  | "reward_token_symbol"
  | "reward_token_amount"
  | "level"
  | "createdAt"
  | "trx_hash"
>;

export async function getPurchaseWithBusd(): Promise<PurchaseHistory[]> {
  let result = await BlockchainRead.purchaseInBUSD(500, 0);

  let finalResult: PurchaseHistory[] = [];
  let roundPrice: string = "0";
  let receiveDXC = 0;
  for (let i = 0; i < result.length; i++) {
    if (result[i]?.roundIndex === 0) {
      roundPrice = String(parseEther("0.8"));
    } else if (result[i]?.roundIndex === 1) {
      roundPrice = String(parseEther("1.2"));
    } else if (result[i]?.roundIndex === 2) {
      roundPrice = String(parseEther("1.5"));
    }

    receiveDXC = Number(result[i]?.busdAmount) / Number(roundPrice);

    finalResult.push({
      trx_hash: result[i]?.txId,
      payment_token_amount: formatEther(result[i]?.busdAmount),
      payment_token_name: "USDT Token",
      payment_token_symbol: "USDT",
      sender_address: result[i]?.publicKey,
      round: result[i]?.roundIndex + 1,
      amountInBusd: formatEther(result[i]?.busdAmount),
      roundPrice: formatEther(roundPrice),
      receivable_token_amount: String(receiveDXC),
      receivable_token_name: "DeXa Coin",
      receivable_token_symbol: "DXC",
      createdAt: Number(result[i]?.createdAt),
    });
  }

  return finalResult;
}

export async function getPurchaseWithNtr(): Promise<PurchaseHistory[]> {
  let result = await BlockchainRead.purchaseInNTR(500, 0);
  let finalResult: PurchaseHistory[] = [];
  let roundPriceInBusd: string = "0";
  let roundPriceInNtr: string = "0";
  let receiveDXC = 0;
  for (let i = 0; i < result.length; i++) {
    if (result[i]?.roundIndex === 0) {
      roundPriceInBusd = String(parseEther("0.8"));
      roundPriceInNtr = String(parseEther("160"));
    } else if (result[i]?.roundIndex === 1) {
      roundPriceInBusd = String(parseEther("1.2"));
      roundPriceInNtr = String(parseEther("140"));
    } else if (result[i]?.roundIndex === 2) {
      roundPriceInBusd = String(parseEther("1.5"));
      roundPriceInNtr = String(parseEther("120"));
    }

    let amountInBusd = calculateBusdForNtrUsers(
      result[i]?.ntrAmount,
      roundPriceInNtr,
      roundPriceInBusd
    );

    receiveDXC = Number(amountInBusd) / Number(roundPriceInBusd);

    finalResult.push({
      trx_hash: result[i]?.txId,
      payment_token_amount: String(
        Number(amountInBusd) / Number(parseEther("1"))
      ),
      payment_token_name: "USDT Token",
      payment_token_symbol: "USDT",
      sender_address: result[i]?.publicKey,
      round: result[i]?.roundIndex + 1,
      amountInBusd: String(Number(amountInBusd) / Number(parseEther("1"))),
      roundPrice: formatEther(roundPriceInBusd),
      receivable_token_amount: String(receiveDXC),
      receivable_token_name: "DeXa Coin",
      receivable_token_symbol: "DXC",
      createdAt: Number(result[i]?.createdAt),
    });
  }

  return finalResult;
}

export async function getPurchaseWithBusdByUser(
  userAddress: string
): Promise<PurchaseHistory[]> {
  let result = await BlockchainRead.purchaseInBUSDByUser(500, 0, userAddress);

  let finalResult: PurchaseHistory[] = [];
  let roundPrice: string = "0";
  let receiveDXC = 0;
  for (let i = 0; i < result.length; i++) {
    if (result[i]?.roundIndex === 0) {
      roundPrice = String(parseEther("0.8"));
    } else if (result[i]?.roundIndex === 1) {
      roundPrice = String(parseEther("1.2"));
    } else if (result[i]?.roundIndex === 2) {
      roundPrice = String(parseEther("1.5"));
    }

    receiveDXC = Number(result[i]?.busdAmount) / Number(roundPrice);

    finalResult.push({
      trx_hash: result[i]?.txId,
      payment_token_amount: formatEther(result[i]?.busdAmount),
      payment_token_name: "USDT Token",
      payment_token_symbol: "USDT",
      sender_address: result[i]?.publicKey,
      round: result[i]?.roundIndex + 1,
      amountInBusd: formatEther(result[i]?.busdAmount),
      roundPrice: formatEther(roundPrice),
      receivable_token_amount: String(receiveDXC),
      receivable_token_name: "DeXa Coin",
      receivable_token_symbol: "DXC",
      createdAt: Number(result[i]?.createdAt),
    });
  }

  return finalResult;
}

export async function getPurchaseWithNtrByUser(
  userAddress: string
): Promise<PurchaseHistory[]> {
  let result = await BlockchainRead.purchaseInNTRByUser(500, 0, userAddress);
  let finalResult: PurchaseHistory[] = [];
  let roundPriceInBusd: string = "0";
  let roundPriceInNtr: string = "0";
  let receiveDXC = 0;
  for (let i = 0; i < result.length; i++) {
    if (result[i]?.roundIndex === 0) {
      roundPriceInBusd = String(parseEther("0.8"));
      roundPriceInNtr = String(parseEther("160"));
    } else if (result[i]?.roundIndex === 1) {
      roundPriceInBusd = String(parseEther("1.2"));
      roundPriceInNtr = String(parseEther("140"));
    } else if (result[i]?.roundIndex === 2) {
      roundPriceInBusd = String(parseEther("1.5"));
      roundPriceInNtr = String(parseEther("120"));
    }

    let amountInBusd = calculateBusdForNtrUsers(
      result[i]?.ntrAmount,
      roundPriceInNtr,
      roundPriceInBusd
    );

    receiveDXC = Number(amountInBusd) / Number(roundPriceInBusd);

    finalResult.push({
      trx_hash: result[i]?.txId,
      payment_token_amount: String(
        Number(amountInBusd) / Number(parseEther("1"))
      ),
      payment_token_name: "USDT Token",
      payment_token_symbol: "USDT",
      sender_address: result[i]?.publicKey,
      round: result[i]?.roundIndex + 1,
      amountInBusd: String(Number(amountInBusd) / Number(parseEther("1"))),
      roundPrice: formatEther(roundPriceInBusd),
      receivable_token_amount: String(receiveDXC),
      receivable_token_name: "DeXa Coin",
      receivable_token_symbol: "DXC",
      createdAt: Number(result[i]?.createdAt),
    });
  }

  return finalResult;
}

export async function getRefRewards(
  userAddress: string
): Promise<RewardBlockchain[]> {
  let result = await BlockchainRead.getReferralRewardInPresale(
    500,
    0,
    userAddress
  );

  let finalResult = [];

  for (let i = 0; i < result.length; i++) {
    finalResult.push({
      id: result[i]?.id,
      sender_address: result[i]?.user,
      reward_token_name: "USDT Token",
      reward_token_symbol: "USDT",
      reward_token_amount: result[i]?.amount,
      level: result[i]?.level,
      createdAt: Number(result[i]?.createdAt),
      trx_hash: result[i]?.txId,
    });
  }

  return finalResult;
}

function calculateBusdForNtrUsers(
  ntrAmount: any,
  roundNtrPrice: any,
  busdRoundPrice: any
) {
  let ntrToDXC =
    (Number(ntrAmount) * Number(parseEther("1"))) / Number(roundNtrPrice);
  let dxcToBusd =
    (Number(ntrToDXC) * Number(busdRoundPrice)) / Number(parseEther("1"));

  return String(dxcToBusd);
}
