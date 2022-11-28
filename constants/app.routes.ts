export const AppRoutes = {
  // onlyPublicPages
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },

  profile: {
    // Authenticated Pages
    account_address: "/profile/[account_address]",
    replies: "/profile/[account_address]/replies",
    following: "/profile/[account_address]/following",
    followers: "/profile/[account_address]/followers",
    archived_posts: "/profile/[account_address]/archived-posts",
    settings: "/profile/settings",

    // Coming soon pages
    nfts: "/profile/[account_address]/nfts",
    purchased: "/profile/[account_address]/purchased",
    collections: "/profile/[account_address]/collections",
  },

  feed: {
    // Authenticated Pages
    index: "/feed",
    single_post: "/feed/[account_address]/post/[post_id]",
  },

  // Authenticated Pages
  notifications: "/notifications",

  // Coming soon pages
  coming_soon: "/coming-soon",
  home: "/",
  explore: "/explore",
  all_collections: "/collections/all",

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
  staking_packs: "/staking-contract",
  liquidity_pool: "/liquidity-pool",

  nfts: {
    nft: "/nfts/[collection]/[tokenId]",
    create_nft: "/nfts/create",
    create_collection: "/nfts/create-collection",
  },
} as const;
