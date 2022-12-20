export const AppRoutes = {
  // onlyPublicPages
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    terms: "/auth/terms",
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
  buy_centher: "/buy-centher",
  profits_dashboard: "/profits-dashboard",
  voting_chain: "/voting-chain",
  staking_packs: "/staking-contract",
  liquidity_pool: "/liquidity-pool",

  marketplace: {
    nft: "/marketplace/[collection]/[tokenId]",
    create_nft: "/marketplace/create",
    create_collection: "/marketplace/create-collection",
    explore: "/marketplace/explore",
    all_nfts: "/marketplace/all-nfts",
    all_collections: "/marketplace/all-collections",
    collection: "/marketplace/[collection]",
  },

  referral: {
    network_genealogy: "/network-genealogy",
    network_rewards: "/network-rewards/rewards",
    overview: "/network-rewards/overview",
  },
} as const;
