export const AppRoutes = {
  // Only Public Pages Start
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  // Only Public Pages End

  // Public or Authenticated Pages Start
  terms: "/terms",
  // Public or Authenticated Pages End

  // Authenticated Pages
  home: "/",
  search: "/search",
  notifications: "/notifications",
  recommended: "/recommended-people",
  citizenship: "/citizenship",

  profile: {
    user_id: "/profile/[user_id]",
    replies: "/profile/[user_id]/replies",
    archived_posts: "/profile/[user_id]/archived-posts",
    team: "/profile/[user_id]/team",
    following: "/profile/[user_id]/community/following",
    followers: "/profile/[user_id]/community/followers",
    referrals: "/profile/[user_id]/community/referrals",
    nfts: "/profile/[user_id]/nfts",
    owned: "/profile/[user_id]/nfts/owned",
    listed: "/profile/[user_id]/nfts/listed",
    created: "/profile/[user_id]/nfts/created",
    collection: "/profile/[user_id]/nfts/collection",
  },

  settings: {
    index: "/settings",
    about: "/settings/about",
    profile: "/settings/profile",
    social_links: "/settings/social-links",
    privacy: "/settings/privacy",
    team: "/settings/team",
    citizen: {
      team_members: "/settings/citizen/team-members",
    },
  },

  chat: {
    index: "/chat",
    single_chat: "/chat/[chat_id]",
  },

  feed: {
    index: "/feed",
    single_post: "/post/[post_id]",
  },

  marketplace: {
    nft: "/marketplace/[collection]/[tokenId]",
    explore: "/marketplace/explore",
    collections: "/marketplace/collections",
    collection: "/marketplace/[collection]",
    activity: "/marketplace/activity",
    // Citizen Only Start
    create_collection: "/marketplace/create-collection",
    create_nft: "/marketplace/create",
    // Citizen Only End
  },

  launchpad: {
    index: "/launchpad/[token_address]/[round]",
    create_launchpad: "/launchpad/create-launchpad",
    launchpad_list: {
      index: "/launchpad/launchpad-list",
      launchpad_list_details: "/launchpad/launchpad-list/[id]",
    },
  },

  staking: {
    index: "/staking",
    staking_details: {
      index: "/staking/staking-details/[id]",
      referrals: "/staking/staking-details/[id]/referrals",
      project_details: "/staking/staking-details/[id]/project-details",
    },
    faqs: "/staking/faqs",
    // Citizen Only Start
    create_staking: "/staking/create-staking",
    // Citizen Only End
  },
  // Authenticated Pages End

  // Coming Soon Pages Start
  coming_soon: "/coming-soon",
  coming_soon_v2: "/coming-soon-v2",
  staking_coming_soon: "/staking-coming-soon",
  // Coming Soon Pages End

  // Not Ready Pages Start
  referral: {
    network_genealogy: "/network-genealogy",
    overview: "/network-rewards/overview",
    network_rewards: "/network-rewards/rewards",
    license: "/network-rewards/license",
    liscense: "/network-rewards/license", // deprecated alias (typo route)
  },

  profits_dashboard: "/profits-dashboard",
  voting_chain: "/voting-chain",
  staking_packs: "/staking-packs",
  liquidity_pool: "/liquidity-pool",

  // Admin Only Start
  admin: {
    index: "/admin",
    staking_packs: "/admin/staking-packs",
    create_staking_pack: "/admin/create-staking-pack",
    update_staking_pack: "/admin/update-staking-pack",
    influencer_requests: "/admin/influencer-requests", // Phase 8: removed (no backend)
    influencer_details: "/admin/influencer-details", // Phase 8: removed (no backend)
    transactions: "/admin/transactions", // Phase 8: removed (no backend)
    users: "/admin/users",
    network_rewards: "/admin/network-rewards/launchpad",
    network_rewards_marketplace: "/admin/network-rewards/marketplace",
    network_rewards_UpdateContract: "/admin/network-rewards/update-contract",
    registration: "/admin/registration",
    registration_setting: "/admin/registration/setting",
  },
  // Admin Only End
  // Not Ready Pages End
} as const;
