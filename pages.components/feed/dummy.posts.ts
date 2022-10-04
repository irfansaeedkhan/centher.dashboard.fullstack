import { Post } from "@/models/post";

const user1 = {
  _id: "5f9f1b9b9c9d2b0017a8b1a1",
  account_address: "0x73468329239987238997324",
  display_name: "User 1",
  profile_image: "/images/feedprofilepic.png",
};

const user2 = {
  _id: "782364287378234",
  account_address: "0x782364287378234",
  display_name: "User 2",
  profile_image: "/images/feedprofilepic.png",
};

const user3 = {
  _id: "832745789734347",
  account_address: "0x832745789734347",
  display_name: "User 3",
  profile_image: "/images/feedprofilepic.png",
};

const user4 = {
  _id: "829348002349874",
  account_address: "0x829348002349874",
  display_name: "User 4",
  profile_image: "/images/feedprofilepic.png",
};

const post1: Post = {
  _id: "9834573786476342356",
  user: user1,
  text_content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  createdAt: new Date().toDateString(),
  media: [
    {
      _id: "1",
      url: "/images/postimage.png",
      type: "image",
    },
  ],
  post_liked_by_loggedin_user: 0,
  comments_count_on_post: 10,
  likes_count_on_post: 24,
  shares_count_on_post: 44,
};

const post2: Post = {
  _id: "8274582973589237589",
  user: user2,
  parent_post: {
    _id: post1._id,
    user: post1.user,
  },
  text_content: "reply 1 to main",
  createdAt: new Date().toDateString(),
  media: [
    {
      _id: "1",
      url: "/images/postimage.png",
      type: "image",
    },
  ],
  post_liked_by_loggedin_user: 0,
  comments_count_on_post: 10,
  likes_count_on_post: 24,
  shares_count_on_post: 44,
};

const post3: Post = {
  _id: "7823748723647238647823",
  user: user3,
  parent_post: {
    _id: post1._id,
    user: post1.user,
  },
  text_content: "reply 2 to main",
  createdAt: new Date().toDateString(),
  media: [
    {
      _id: "1",
      url: "/images/postimage.png",
      type: "image",
    },
  ],
  post_liked_by_loggedin_user: 0,
  comments_count_on_post: 10,
  likes_count_on_post: 24,
  shares_count_on_post: 44,
};

const post4: Post = {
  _id: "28734627832738423",
  user: user3,
  parent_post: {
    _id: post2._id,
    user: post2.user,
  },
  text_content: "reply 3 to reply 1",
  createdAt: new Date().toDateString(),
  media: [
    {
      _id: "1",
      url: "/images/postimage.png",
      type: "image",
    },
  ],
  post_liked_by_loggedin_user: 0,
  comments_count_on_post: 10,
  likes_count_on_post: 24,
  shares_count_on_post: 44,
};

const post5: Post = {
  _id: "873465783246578234",
  user: user4,
  parent_post: {
    _id: post2._id,
    user: post2.user,
  },
  text_content: "reply 4 to reply 1",
  createdAt: new Date().toDateString(),
  media: [
    {
      _id: "1",
      url: "/images/postimage.png",
      type: "image",
    },
  ],
  post_liked_by_loggedin_user: 0,
  comments_count_on_post: 10,
  likes_count_on_post: 24,
  shares_count_on_post: 44,
};

const post6: Post = {
  _id: "78246872364t72344432",
  user: user1,
  parent_post: {
    _id: post4._id,
    user: post4.user,
  },
  text_content: "reply 5 to reply 3",
  createdAt: new Date().toDateString(),
  media: [
    {
      _id: "1",
      url: "/images/postimage.png",
      type: "image",
    },
  ],
  post_liked_by_loggedin_user: 0,
  comments_count_on_post: 10,
  likes_count_on_post: 24,
  shares_count_on_post: 44,
};

// const post7: Post = {
//   _id: "78246872364t72344432",
//   user: user2,
//   parent_post: {
//     _id: post4._id,
//     user: post4.user,
//   },
//   post_liked_by_loggedin_user:0,
//   text_content: "reply 6 to reply 3",
//   createdAt: new Date().toDateString(),
//   media: [
//     {
//       _id: "1",
//       url: "/images/postimage.png",
//       type: "image",
// }]};
