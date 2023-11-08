export const roundCardData: RoundCardData[] = [
  {
    round: 1,
    title: "Verify Token",
    description: "Enter the token address and verify",
  },
  {
    round: 2,
    title: "Rounds Settings",
    description:
      "Enter the details and information about the launchpad you want to raise,  including all details about your presale.",
  },
  {
    round: 3,
    title: "Add Additional Info",
    description: "Let people know who you are",
  },
  {
    round: 4,
    title: "Finish",
    description: "Review your information",
  },
];

export type RoundCardData = {
  round: number;
  title: string;
  description: string;
};
