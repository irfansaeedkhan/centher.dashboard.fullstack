import { ListCardDataOBj } from "@/pages/staking/_components/list-card-data";

const oneYearInSec = 31449600;
const oneMonthInSec = 2629743;
export function getStakeId(id: string): number {
  return +id.split("_")[2];
}

export function calculateNextReward(
  pool: ListCardDataOBj,
  amount: number
): number {
  return Math.floor(
    +(+pool.apy / 10000) * +amount * +(+pool.claim_period / oneYearInSec)
  );
}

export function calculateNextRefReward(
  pool: ListCardDataOBj,
  amount: any,
  level: any
): string {
  const percent = pool.rewards_level?.find((e) => +e.level == +level)?.percent;
  if (percent) {
    return Math.floor((amount * percent) / 10000) + "";
  } else return "0";
}
