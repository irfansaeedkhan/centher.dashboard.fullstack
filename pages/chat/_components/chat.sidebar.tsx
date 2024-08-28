import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";
import clsx from "clsx";
import { getUserByIdFromDB } from "@/lib/get-user-by-id";
import Button from "@/components/button";
import { ChatFriendListSkeleton } from "@/components/loading.skeletons/chat.skeletons";
import { useProductLive } from "@/hooks/chat";
import { eqAddress } from "@/live/utils/address.utils";
import { IConversation } from "@/live/types";
import { axiosApi369x } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";
import { User } from "@/models/user";
import { AppRoutes } from "@/constants/app.routes";
import { EyeIcon, NewMessageIcon, SearchIcon } from "@/assets/svgs";
import { BackButton } from "@/components/button/back-button";
import SingleChatSidebar from "./single-chat-sidebar";
import { ChatModal } from "./chat-modal";
import NewConversationModal from "./new-conversation-modal";

export interface UsersDetails {
  _id: User["_id"];
  display_name: User["display_name"];
  profile_image: User["profile_image"];
}

const ChatSidebar = () => {
  const router = useRouter();
  const { conversations, conversationLoading, adapter } = useProductLive();
  const [filteredConversations, setFilteredConversations] =
    useState<IConversation[]>(conversations);
  const [loading, setLoading] = useState<boolean>(false);
  const [showConversationModal, setShowConversationModal] =
    useState<boolean>(false);
  const [network, setNetwork] = useState<any[]>([]);
  const [showingNetwork, setShowingNetwork] = useState<any[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSelectConversation, setIsSelectConversation] =
    useState<boolean>(false);
  const [newConversationId, setNewConversationId] = useState<string>("");

  const [ConversationsUsers, setConvesationUsers] = useState<UsersDetails[]>(
    []
  );

  useEffect(() => {
    setFilteredConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    const fetchUserData = async (usersAddresses: string[]) => {
      const usersDetailsPromise = usersAddresses.map((item) =>
        getUserByIdFromDB(item)
      );

      const details = (await Promise.allSettled(usersDetailsPromise)).filter(
        (item) => item.status === "fulfilled"
      ) as PromiseFulfilledResult<UsersDetails>[];
      const users = details.map((e) => e.value);
      return users;
    };

    if (conversations?.length && !ConversationsUsers?.length) {
      // fetch all users data
      const allUsers = conversations
        .filter((e) => e.is_channel == false)
        .map((e) => e.user_conversations)
        .flat()
        .map((e) => e.user_address);

      if (!allUsers?.length) {
        return;
      }

      const nonDuplicatedUsers: string[] = [];
      allUsers.forEach((e) => {
        if (nonDuplicatedUsers.indexOf(e) == -1) {
          nonDuplicatedUsers.push(e);
        }
      });

      if (!nonDuplicatedUsers?.length) {
        return;
      }

      fetchUserData(nonDuplicatedUsers)
        .then((users) => {
          setConvesationUsers(users);
        })
        .catch((e) => {
          customLog(["development", "staging"], e);
        });
    }

    if (conversations?.length && ConversationsUsers?.length) {
      // find new users and fetch them
      const allUsers = conversations
        .filter((e) => e.is_channel == false)
        .map((e) => e.user_conversations)
        .flat()
        .map((e) => e.user_address);

      const newUsers = allUsers.filter(
        (e) => ConversationsUsers.findIndex((s) => eqAddress(e, s._id)) == -1
      );

      if (!newUsers?.length) {
        return;
      }

      const nonDuplicatedUsers: string[] = [];
      newUsers.forEach((e) => {
        if (nonDuplicatedUsers.indexOf(e) == -1) {
          nonDuplicatedUsers.push(e);
        }
      });

      if (!nonDuplicatedUsers?.length) {
        return;
      }

      fetchUserData(nonDuplicatedUsers)
        .then((users) => {
          setConvesationUsers([...users, ...ConversationsUsers]);
        })
        .catch((e) => {
          customLog(["development", "staging"], e);
        });
    }
  }, [conversations, ConversationsUsers]);

  useEffect(() => {
    if (!network.length) {
      getNetwork().catch((e) => {
        customLog(["development", "staging"], e);
      });
    }
  }, [network]);

  const getNetwork = async () => {
    try {
      setLoading(false);

      const offset = 0;
      const limit = 100;

      const followersUrl = `/api/socials/users/my-followers?offset=${offset}&limit=${limit}`;
      const followingUrl = `/api/socials/users/my-following?offset=${offset}&limit=${limit}`;

      const { data: followersResponse } = await axiosApi369x.get(followersUrl);
      const { data: followingResponse } = await axiosApi369x.get(followingUrl);

      const nonDuplicatedNetwork: any[] = [];
      [...followersResponse.followers, ...followingResponse.following].forEach(
        (e) => {
          if (!nonDuplicatedNetwork.find((s) => s._id == e._id)) {
            nonDuplicatedNetwork.push(e);
          }
        }
      );
      setNetwork(nonDuplicatedNetwork);
      setShowingNetwork(nonDuplicatedNetwork);
      setLoading(true);
    } catch (error) {
      throw error;
    }
  };

  const filterConversations = (searchedValue: string) => {
    if (!searchedValue?.length) {
      setFilteredConversations(conversations);
    }
    if (network?.length && searchedValue != ".." && searchedValue != "...") {
      const filteredUsers = ConversationsUsers.filter((e) => {
        return (
          e.display_name?.toLowerCase().indexOf(searchedValue.toLowerCase()) !=
            -1 || e._id.toLowerCase().indexOf(searchedValue.toLowerCase()) != -1
        );
      });
      const filteredValues = conversations.filter((con) => {
        const user = con.user_conversations.find((e) =>
          filteredUsers.find((s) => eqAddress(s._id, e.user_address))
        );
        return !!user;
      });
      setFilteredConversations(filteredValues);
    }
  };

  const createNewPrivateConversation = async (
    e: React.MouseEvent<HTMLButtonElement>,
    user: string
  ) => {
    const button = e.currentTarget as HTMLButtonElement;
    button.disabled = true;
    try {
      if (adapter) {
        const result = await adapter.createNewPrivateConversation({
          targetUser: user.toLowerCase(),
        });
        setNewConversationId(result);
        router.push(`/chat/${result}`);
      } else throw new Error("Invalid stream handler instance");
    } catch (err: any) {
      customLog(["development", "staging"], err);
      toast.error(err?.message ? err?.message : "Can not start chat");
    } finally {
      setShowConversationModal(false);
      button.disabled = false;
    }
  };

  const openNetworkModal = async () => {
    if (!network?.length) {
      await getNetwork();
    }
    setShowConversationModal(true);
  };

  const onClickSelectConversation = () => {
    setIsSelectConversation((prev) => !prev);
  };

  const onClickDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const deleteConversation = async (data: any) => {
    adapter?.deleteConversation(data.id);
    router.push(`/chat`);
  };

  const pinConversation = async (data: any) => {
    adapter?.pinConversation(data.id);
    if (data.id != router.query?.chat_id) {
      router.push(`/chat/${data.id}`);
    }
  };

  const unpinConversation = async (data: any) => {
    adapter?.unpinConversation(data.id);
  };

  return (
    <div
      className={clsx(
        "relative min-h-[calc(100vh-60px)] w-full flex-shrink-0 border-r border-gray-shade-3 pt-2 lg:w-[384px]",
        router.pathname === AppRoutes.chat.single_chat && "hidden flg:block"
      )}
    >
      <div className="mb-6 flex items-center justify-between px-4 text-xl font-semibold text-white md:px-6">
        <BackButton className="flg:hidden" />
        <h6>Chats</h6>
        <button
          onClick={() => {
            openNetworkModal();
          }}
        >
          <NewMessageIcon />
        </button>
      </div>
      {/* When there is no chat */}
      {!conversationLoading && conversations.length == 0 ? (
        <div className="mx-auto w-full max-w-[340px] space-y-2 px-4 sm:px-0 lg:max-w-full lg:px-6">
          <h3 className="text-xl font-semibold leading-[24.38px] text-white sm:text-2xl sm:leading-[29.26px]">
            Send a message, get a message
          </h3>
          <div className="">
            <p className="text-xs font-medium leading-[14.63px] text-gray-shade-7 sm:text-sm sm:leading-[17.07px]">
              Direct Messages are private conversations between you and other
              people on 369x.
            </p>
            <Button
              title="Start conversation"
              variant="primary"
              className="mt-6"
              onClick={() => {
                setShowConversationModal(true);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="px-6">
          <div className="focus-within:gradient-border-3 mb-3 flex h-10 w-full items-center gap-2 !rounded-xl bg-elevation-1 p-[1px]">
            <span className="ml-3">
              <SearchIcon />
            </span>
            <input
              type="search"
              placeholder="Search"
              className="mr-3 w-full rounded-xl border-0 bg-transparent p-0 text-sm text-white focus:outline-none focus:ring-0"
              onChange={(e) => filterConversations(e.target.value)}
            />
          </div>
        </div>
      )}
      <div
        className={clsx(
          "scrollSetLight max-h-[calc(100vh-202px)] overflow-y-auto",
          conversationLoading ? "h-auto" : "h-full"
        )}
      >
        {!conversationLoading &&
          filteredConversations
            .sort((a, b) => {
              if (newConversationId && a.updated_at === null) {
                if (a.id === newConversationId) {
                  return -1;
                }
                return 0;
              } else {
                if (a.id === router.query?.chat_id && a.updated_at === null) {
                  return -1;
                }
                return 0;
              }
            })
            .map((item, index) => (
              <SingleChatSidebar
                key={index}
                data={item}
                users={ConversationsUsers}
                onClickSelectConversation={onClickSelectConversation}
                isSelectConversation={isSelectConversation}
                onDeleteConversation={deleteConversation}
                pinConversation={pinConversation}
                unpinConversation={unpinConversation}
              />
            ))}
      </div>
      {conversationLoading && (
        <div className="mx-auto w-[90%]">
          <ChatFriendListSkeleton />
        </div>
      )}
      {isSelectConversation && (
        <div className="absolute bottom-0 flex w-full items-center justify-between bg-background-shade-3 px-4 py-6 text-sm">
          <button className="flex items-center justify-start gap-3  text-white">
            <EyeIcon className="h-auto -scale-90" />
            <span className="min-w-max">Mark as read</span>
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center justify-start gap-3  text-red-theme"
          >
            <FiTrash2 className="h-auto w-[20px] stroke-red-theme" />
            <span className="min-w-max">Delete</span>
          </button>
        </div>
      )}
      {showConversationModal && (
        <NewConversationModal
          onClose={() => {
            setShowConversationModal(false);
          }}
          createNewPrivateConversation={createNewPrivateConversation}
          networkData={network}
          loading={loading}
        />
      )}
      <ChatModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onAction={onClickDelete}
        content="Do you want to delete this conversation? This process cannot be
        undone."
        title="Delete conversation"
      />
    </div>
  );
};

export default ChatSidebar;
