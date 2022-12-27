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
  {
    id: 1,
    rateNTR: 600,
    percentage: 0.25,
    profit: 1.2,
    claimLockup: "Unlimited",
    duration: "Life-time",
  },
  {
    id: 2,
    rateNTR: 700,
    percentage: 0.5,
    profit: 1.7,
    claimLockup: "Unlimited",
    duration: "Life-time",
  },
];
