import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface ProfileCard {
  _id: string;
  account_address: string;
  posts_count: number;
  followers_count: number;
  following_count: number;
  posts_views_count: number | null;
  profile_views_count: number | null;
}

export interface ProfileCardStore {
  profileCard: ProfileCard;
  setProfileCard: (profileCard: ProfileCard) => void;
  incrementPostsCount: () => void;
  decrementPostsCount: () => void;
  incrementFollowersCount: () => void;
  decrementFollowersCount: () => void;
}

export const initialProfileCard: ProfileCard = {
  _id: "",
  account_address: "",
  followers_count: 0,
  posts_count: 0,
  following_count: 0,
  posts_views_count: null,
  profile_views_count: null,
};

export const useProfileCardStore = create<ProfileCardStore>()(
  devtools(
    (set) => ({
      profileCard: initialProfileCard,
      setProfileCard: (profileCard: ProfileCard) => set({ profileCard }),
      incrementPostsCount: () =>
        set((state) => ({
          profileCard: {
            ...state.profileCard,
            posts_count: state.profileCard.posts_count + 1,
          },
        })),
      decrementPostsCount: () =>
        set((state) => ({
          profileCard: {
            ...state.profileCard,
            posts_count: state.profileCard.posts_count - 1,
          },
        })),
      incrementFollowersCount: () =>
        set((state) => ({
          profileCard: {
            ...state.profileCard,
            followers_count: state.profileCard.followers_count + 1,
          },
        })),
      decrementFollowersCount: () =>
        set((state) => ({
          profileCard: {
            ...state.profileCard,
            followers_count: state.profileCard.followers_count - 1,
          },
        })),
    }),
    { name: "profileCardStore" }
  )
);
