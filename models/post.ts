export interface Post {
  _id: string;
  parent_post?: {
    _id: string;
    user: {
      _id: string;
      account_address: string;
      profile_image: string;
      display_name: string;
      custom_image: boolean;
    };
  };
  text_content?: string;
  user: {
    _id: string;
    account_address: string;
    profile_image: string;
    display_name: string;
    custom_image: boolean;
  };
  media?: Media[];
  post_liked_by_loggedin_user: 0 | 1;
  comments_count_on_post: number;
  shares_count_on_post: number;
  likes_count_on_post: number;
  createdAt: string;
}

interface Media {
  url: string;
  type: "image" | "video";
  alt?: string;
}
