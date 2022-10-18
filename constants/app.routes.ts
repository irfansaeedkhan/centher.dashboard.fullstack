export const AppRoutes = {
  // Only unauthenticated users can access
  // onlyPublicPages
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },

  profile: {
    account_address: "/profile/[account_address]",
    settings: "/profile/settings",
  },

  // Anyone can access
  home: "/",
  explore: "/explore",
  top_influencers: "/top-influencers",

  // Unauthenticated users can not access
  // authenticatedAndActiveUserPages
  feed: "/feed",
  single_post: "/feed/[account_address]/post/[post_id]",
  user_profile: "/profile/[account_address]",
  user_nfts_profile: "/profile/[account_address]/nfts",
  chat: "/chat",
  notifications: "/notifications",
  create_nft: "/nft/create",
  create_collection: "/nft/create-collection",
  staking_packs: "/staking-pack",
  network_rewards: "/network-rewards",
  buy_ntr_dao: "/buy-ntr-dao",
  profits_dashboard: "/profits-dashboard",
  voting_chain: "/voting-chain",
  referral_program: "/referral-program",
  admin_staking_packs: "/admin/staking-packs",
  admin_network_rewards: "/admin/network-rewards",
  admin_influencer_request: "/admin/influencer-request",
  admin_transactions: "/admin/transaction",
  admin_users: "/admin/user",
  admin_influencer_details: "/admin/influencer-detail",
} as const;
