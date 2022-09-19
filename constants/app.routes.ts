export const AppRoutes = {
  // Only unauthenticated users can access
  login: "/login",
  register: "/register",
  forgot_password: "/forgot-password",
  reset_password: "/reset-password",

  // Authenticated AND registration pending users can access
  pay_registration_fee: "/pay-registration-fee",

  // Anyone can access
  home: "/",
  top_influencers: "/top-influencers",

  // Unauthenticated users can not access
  feed: "/feed",
  chat: "/chat",
  notifications: "/notifications",
  create_collection: "/create-collection",
  staking_pack: "/staking-pack",
  network_rewards: "/network-rewards",
  buy_ntr_dao: "/buy-ntr-dao",
  profits_dashboard: "/profits-dashboard",
  voting_chain: "/voting-chain",
  referral_program: "/referral-program",
} as const;
