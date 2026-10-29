import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface ProfileCard {
  _id: string;
  posts_count: number;
  followers_count: number;
  following_count: number;
  total_referrees: number;
  posts_views_count: number | null;
  profile_views_count: number | null;
  /**
   * Feed fix 2026-10-29 (stats flicker): false until the profile-card
   * API has returned for the CURRENT user. The numeric fields start
   * at 0, which used to render as a real "0 posts / 0 followers"
   * before the fetch landed. Consumers must render "--" (not the
   * numbers) while isLoaded is false; a real 0 only shows after a
   * successful load. A failed load also leaves isLoaded false, so an
   * error never flashes as 0 either.
   */
  isLoaded: boolean;
}

export interface ProfileCardStore {
  profileCard: ProfileCard;
  /** Store a freshly fetched card; marks it loaded. */
  setProfileCard: (
    profileCard: Omit<ProfileCard, "isLoaded">
  ) => void;
  /** Mark the current card stale (user changed / refetch started). */
  markProfileCardLoading: () => void;
  incrementPostsCount: (increment?: number) => void;
  /**
   * Decrement, but only when the card is loaded and (when ownerId is
   * given) it belongs to that owner. Skipping while unloaded matters:
   * decrementing the initial 0 would go to -1, and the next fetch
   * would overwrite it anyway; after the server fix the fetch already
   * excludes deleted posts, so the loaded count is the truth.
   */
  decrementPostsCount: (ownerId?: string) => void;
  incrementFollowersCount: () => void;
  decrementFollowersCount: () => void;
}

export const initialProfileCard: ProfileCard = {
  _id: "",
  followers_count: 0,
  posts_count: 0,
  following_count: 0,
  total_referrees: 0,
  posts_views_count: null,
  profile_views_count: null,
  isLoaded: false,
};

const isSameOwner = (cardId: string, ownerId?: string) =>
  !ownerId ||
  !cardId ||
  cardId.toLowerCase() === ownerId.toLowerCase();

export const useProfileCardStore = create<ProfileCardStore>()(
  devtools(
    (set) => ({
      profileCard: initialProfileCard,
      setProfileCard: (profileCard) =>
        set({ profileCard: { ...profileCard, isLoaded: true } }),
      markProfileCardLoading: () =>
        set((state) => ({
          profileCard: {
            ...state.profileCard,
            // Hide stale counts/views while the new user loads; the
            // numbers are kept only so a later load can replace them.
            posts_views_count: null,
            profile_views_count: null,
            isLoaded: false,
          },
        })),
      incrementPostsCount: (increment?: number) =>
        set((state) => {
          // Unloaded card: the pending fetch already reflects the
          // new post, so applying +n to the initial 0 would overshoot.
          if (!state.profileCard.isLoaded) return state;
          return {
            profileCard: {
              ...state.profileCard,
              posts_count: state.profileCard.posts_count + (increment ?? 1),
            },
          };
        }),
      decrementPostsCount: (ownerId?: string) =>
        set((state) => {
          if (!state.profileCard.isLoaded) return state;
          if (!isSameOwner(state.profileCard._id, ownerId)) return state;
          return {
            profileCard: {
              ...state.profileCard,
              posts_count: Math.max(
                0,
                state.profileCard.posts_count - 1
              ),
            },
          };
        }),
      incrementFollowersCount: () =>
        set((state) => {
          if (!state.profileCard.isLoaded) return state;
          return {
            profileCard: {
              ...state.profileCard,
              followers_count: state.profileCard.followers_count + 1,
            },
          };
        }),
      decrementFollowersCount: () =>
        set((state) => {
          if (!state.profileCard.isLoaded) return state;
          return {
            profileCard: {
              ...state.profileCard,
              followers_count: Math.max(
                0,
                state.profileCard.followers_count - 1
              ),
            },
          };
        }),
    }),
    {
      name: "profileCardStore",
      enabled: process.env.NEXT_PUBLIC_APP_ENV !== "production",
    }
  )
);
