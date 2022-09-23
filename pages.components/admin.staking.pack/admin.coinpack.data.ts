// types
export interface StakingPack {
  id: number;
  rateNTR: number;
  percentage: number;
  profit: number;
  claimLockup: string;
  duration: string;
}

// dummy data
export const StakingPackList: StakingPack[] = [
  {
    id: 0,
    rateNTR: 500,
    percentage: 0.15,
    profit: 0.8,
    claimLockup: "Unlimited",
    duration: "Life-time",
  },
];
