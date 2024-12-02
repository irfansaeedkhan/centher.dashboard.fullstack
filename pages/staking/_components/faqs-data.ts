export const faqsData: Faq[] = [
  {
    id: 1,
    question: "How to stake your Tokens?",
    answer: `On ${process.env.NEXT_PUBLIC_BRAND_NAME}, navigate to Staking page and choose the Staking Project you want to invest in, click on it to open the main project page and insert the amount of token you want to stake. All the details about your rewards and lock period can be found on the project details page. You can only stake tokens you have already purchased or received and have in your wallet.`,
  },
  {
    id: 2,
    question: "Which advantages do I get by staking in more than one project?",
    answer:
      "Each project gives different rewards based on Token APY, Staking / Reward Token Price Ratio and claim period. Diversifying your portfolio gives you higher chances at having successful staking with great earnings from different projects.",
  },
  {
    id: 3,
    question: "What if not all tokens or NFTs are eligible for staking?",
    answer:
      "Only the NFTs and tokens marked as stakable by the projects owners will be eligible for staking. In case your assets are eligible for staking, go to Staking page and choose the Staking Project you want to invest in.",
  },
  {
    id: 4,
    question: "What will the staking rewards depend on?",
    answer:
      "The staking rewards will depend mainly on APY and Staking / Reward Token Price Ratio. Each project will have different claiming periods and of course the initial staked amount will affect the kind of profit you can make on daily, weekly, monthly basis.",
  },
];

export type Faq = {
  id: number;
  question: string;
  answer: string;
};
