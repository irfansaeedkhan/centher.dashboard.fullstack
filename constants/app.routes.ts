export const AppRoutes = {
  // Only unauthenticated users can access
  // onlyPublicPages
  auth: {
    login: "/auth/login",
    register: "/auth/register",

    // Authenticated AND registration pending users can access
    pay_registration_fee: "/auth/pay-registration-fee",
  },

  profile: {
    account_address: "/profile/[account_address]",
  },

  // Anyone can access
  home: "/",
  top_influencers: "/top-influencers",

  // Unauthenticated users can not access
  // Authenticated but registration_fee_pending users can not access
  // authenticatedAndActiveUserPages
  feed: "/feed",
  single_post: "/feed/[account_address]/post/[post_id]",
  user_profile: "/profile",
  user_NFTprofile: "/profile/nftprofile",
  chat: "/chat",
  notifications: "/notifications",
  create_collection: "/create-collection",
  staking_packs: "/staking-packs",
  network_rewards: "/network-rewards",
  buy_ntr_dao: "/buy-ntr-dao",
  profits_dashboard: "/profits-dashboard",
  voting_chain: "/voting-chain",
  referral_program: "/referral-program",
  admin_staking_pack: "/admin",
  admin_network_rewards: "/admin/network-rewards",
  admin_influencer_request: "/admin/influencer-request",
  admin_transactions: "/admin/transaction",
  admin_users: "/admin/user",
  admin_influencer_details: "/admin/influencer-detail",
} as const;
