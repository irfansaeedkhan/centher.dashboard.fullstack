interface ChatMessage {
  id: number;
  userName: string;
  userImage: string;
  message: string;
  time: string;
  isReply?: boolean;
  replyTo?: string;
}

export const messages: ChatMessage[] = [
  {
    id: 1,
    userName: "Hala Yasmin",
    userImage: "/images/profiles/Profile-0.svg",
    message: "Hello and welcome to the room by traders world.",
    time: "Just now",
  },
  {
    id: 2,
    userName: "Jesper alin",
    userImage: "/images/profiles/Profile-1.svg",
    message: "Thanks for creating awesome community",
    time: "Just now",
    isReply: true,
    replyTo: "Hala",
  },
  {
    id: 3,
    userName: "Jay arman",
    userImage: "/images/profiles/Profile-2.svg",
    message: "Hello",
    time: "Just now",
  },
  {
    id: 4,
    userName: "Jesper alin",
    userImage: "/images/profiles/Profile-3.svg",
    message: "Thanks for creating awesome community",
    time: "Just now",
    isReply: true,
    replyTo: "Hala",
  },
  {
    id: 5,
    userName: "Hala Yasmin",
    userImage: "/images/profiles/Profile-0.svg",
    message: "Hello and welcome to the room by traders world.",
    time: "Just now",
  },
  {
    id: 6,
    userName: "Jesper alin",
    userImage: "/images/profiles/Profile-1.svg",
    message: "Thanks for creating awesome community",
    time: "Just now",
    isReply: true,
    replyTo: "Hala",
  },
  {
    id: 7,
    userName: "Jay arman",
    userImage: "/images/profiles/Profile-2.svg",
    message: "Hello",
    time: "Just now",
  },
  {
    id: 8,
    userName: "Jesper alin",
    userImage: "/images/profiles/Profile-3.svg",
    message: "Thanks for creating awesome community",
    time: "Just now",
    isReply: true,
    replyTo: "Hala",
  },
];
