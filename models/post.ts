export interface Post {
  _id: string;
  parent_post?: {
    _id: string;
    user: {
      _id: string;
      account_address: string;
      profile_image: string;
      display_name: string;
    };
  };
  text_content?: string;
  user: {
    _id: string;
    account_address: string;
    profile_image: string;
    display_name: string;
  };
  media?: Media[];
  comments_count_on_post: number;
  shares_count_on_post: number;
  likes_count_on_post: number;
  createdAt: string;
}

interface Media {
  _id: string;
  url: string;
  type: "image/jpeg" | "video/mp4";
  alt?: string;
}
