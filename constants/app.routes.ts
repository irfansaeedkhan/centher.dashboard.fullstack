export const AppRoutes = {
  // onlyPublicPages
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },

  profile: {
    // Public Pages
    account_address: "/profile/[account_address]",

    // Coming soon pages
    nfts: "/profile/[account_address]/nfts",

    // Authenticated Pages
    settings: "/profile/settings",
  },

  feed: {
    // Authenticated Pages
    index: "/feed",
    // Public Pages
    single_post: "/feed/[account_address]/post/[post_id]",
  },

  // Authenticated Pages
  notifications: "/notifications",

  // Coming soon pages
  coming_soon: "/coming-soon",
  home: "/",
  explore: "/explore",
  top_influencers: "/top-influencers",

  admin: {
    index: "/admin",
    staking_packs: "/admin/staking-packs",
    create_staking_pack: "/admin/create-staking-pack",
    update_staking_pack: "/admin/update-staking-pack",
    network_rewards: "/admin/network-rewards",
    influencer_requests: "/admin/influencer-requests",
    influencer_details: "/admin/influencer-details",
    transactions: "/admin/transactions",
    users: "/admin/users",
  },

  chat: "/chat",
  buy_ntr_dao: "/buy-ntr-dao",
  network_rewards: "/network-rewards",
  profits_dashboard: "/profits-dashboard",
  voting_chain: "/voting-chain",
  referral_program: "/referral-program",
  staking_packs: "/staking-pack",

  nfts: {
    create_nft: "/nfts/create",
    create_collection: "/nfts/create-collection",
  },
} as const;
