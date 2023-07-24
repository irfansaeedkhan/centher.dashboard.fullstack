import { BlockchainRead } from "@/web3/blockchain";

export async function getAllUserGenealogy(userId: string): Promise<any[]> {
  let counter = 0;
  const levels: any[] = [];
  let referrersToFetch = [userId];
  do {
    if (referrersToFetch.length) {
      const result = await BlockchainRead.getGenealogy(referrersToFetch);
      referrersToFetch = result.map((e) => e.publicKey);

      if (result) {
        levels.push(result);
      }
    } else levels.push([]);
    counter++;
  } while (counter < 6);

  return levels;
}
