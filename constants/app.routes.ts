export const AppRoutes = {
  // onlyPublicPages
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },

  // Public or Authenticated Pages
  terms: "/terms",

  profile: {
    // Authenticated Pages
    account_address: "/profile/[account_address]",
    replies: "/profile/[account_address]/replies",
    following: "/profile/[account_address]/community/following",
    followers: "/profile/[account_address]/community/followers",
    referrals: "/profile/[account_address]/community/referrals",
    archived_posts: "/profile/[account_address]/archived-posts",

    nfts: "/profile/[account_address]/nfts",
    owned: "/profile/[account_address]/nfts/owned",
    listed: "/profile/[account_address]/nfts/listed",
    created: "/profile/[account_address]/nfts/created",
    collection: "/profile/[account_address]/nfts/collection",
  },

  marketplace: {
    nft: "/marketplace/[collection]/[tokenId]",
    create_nft: "/marketplace/create",
    create_collection: "/marketplace/create-collection",
    explore: "/marketplace/explore",
    nfts: "/marketplace/nfts",
    collections: "/marketplace/collections",
    collection: "/marketplace/[collection]",
  },

  settings: {
    index: "/settings",
    about: "/settings/about",
    profile: "/settings/profile",
    social_links: "/settings/social-links",
    privacy: "/settings/privacy",
    citizenship_add_details: "/settings/citizenship-add-details",
  },

  feed: {
    // Authenticated Pages
    index: "/feed",
    single_post: "/post/[post_id]",
  },

  // Authenticated Pages
  home: "/",
  search: "/search",
  coming_soon: "/coming-soon",
  coming_soon_v2: "/coming-soon-v2",
  notifications: "/notifications",
  recommended: "/recommended-people",
  launchpad: "/launchpad/[token_address]/[round]",
  launchpad_pre_booking: {
    index: "/launchpad/pre-booking",
    booking: "/launchpad/pre-booking/bookings",
  },
  staking: {
    index: "/staking",
    create_staking: "/staking/create-staking",
    staking_list: "/staking/staking-list",
    staking_details: "/staking/staking-details",
  },

  // Not ready pages
  referral: {
    network_genealogy: "/network-genealogy",
    network_rewards: "/network-rewards/rewards",
    overview: "/network-rewards/overview",
    liscense: "/network-rewards/liscense",
  },

  chat: { index: "/chat", single_chat: "/chat/[chat_id]" },
  profits_dashboard: "/profits-dashboard",
  voting_chain: "/voting-chain",
  staking_packs: "/staking-packs",
  liquidity_pool: "/liquidity-pool",

  admin: {
    index: "/admin",
    staking_packs: "/admin/staking-packs",
    create_staking_pack: "/admin/create-staking-pack",
    update_staking_pack: "/admin/update-staking-pack",
    influencer_requests: "/admin/influencer-requests",
    influencer_details: "/admin/influencer-details",
    transactions: "/admin/transactions",
    users: "/admin/users",
    network_rewards: "/admin/network-rewards/launchpad",
    registration: "/admin/registration",
    registration_setting: "/admin/registration/setting",
    network_rewards_marketplace: "/admin/network-rewards/marketplace",
    network_rewards_UpdateContract: "/admin/network-rewards/update-contract",
  },
  chat_coming_soon: "/chat-coming-soon",
  staking_coming_soon: "/staking-coming-soon",
  citizenship_coming_soon: "/citizenship-coming-soon",
  citizenship_subscription_coming_soon: "/citizenship-subscription-coming-soon",
} as const;
