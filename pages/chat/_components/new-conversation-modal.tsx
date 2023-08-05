import React, { useState } from "react";
import Image from "next/image";
import { SearchIcon } from "@/assets/svgs";
import { ChatFriendListSkeleton } from "@/components/loading.skeletons/chat.skeletons";
import { IoClose } from "react-icons/io5";

interface ComponentProp {
  onClose: () => void;
  createNewPrivateConversation: (
    e: React.MouseEvent<HTMLButtonElement>,
    prop: any
  ) => void;
  networkData: any;
  loading: any;
}

const NewConversationModal: React.FC<ComponentProp> = ({
  onClose,
  createNewPrivateConversation,
  networkData,
  loading,
}) => {
  const [showingNetwork, setShowingNetwork] = useState<any[]>(networkData);

  const filterNetwork = (searchedValue: string) => {
    if (!searchedValue?.length) {
      setShowingNetwork(networkData);
    }

    if (
      networkData?.length &&
      searchedValue != ".." &&
      searchedValue != "..."
    ) {
      const filteredValues = networkData.filter(
        (e: any) =>
          e._id.toLowerCase().indexOf(searchedValue.toLowerCase()) != -1 ||
          e.display_name.toLowerCase().indexOf(searchedValue.toLowerCase()) !=
            -1
      );
      setShowingNetwork(filteredValues);
    }
  };

  const onSearchBoxUsing = (e: any) => {
    filterNetwork(e.target.value);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-lg backdrop-filter focus:outline-none 
  `}
    >
      {/*content*/}
      <div
        className={`relative mx-3 flex w-full flex-col rounded-2xl bg-popup-0 p-4 focus:outline-none fmd:w-140 fmd:p-6 flg:w-164 f2xl:w-164`}
      >
        {/*header*/}
        <div
          className={`relative flex h-[28px] items-center justify-between rounded-t`}
        >
          <button className={`text-white`} onClick={onClose}>
            <IoClose className="h-6 w-6" />
          </button>
          <span
            className={`text-[16px] font-semibold text-white fmd:text-[18px]`}
          >
            Start New Conversation
          </span>
          <div className=""></div>
        </div>
        <div className={`max-h-[600px] overflow-y-auto`}>
          <div className="mt-7 text-white">
            <div className="flex w-full items-center rounded-xl bg-black-shade-3 px-4 py-2 focus-within:border focus-within:border-brand-primary">
              <SearchIcon />
              <input
                type="text"
                className="w-full border-0 bg-transparent focus:ring-0"
                placeholder="Search"
                onChange={onSearchBoxUsing}
              />
            </div>
            <div className="mt-6">
              {loading &&
                showingNetwork.map((e, i) => (
                  <button
                    key={i}
                    className="mt-2 flex w-full cursor-pointer items-center gap-2 py-4 px-6 hover:bg-[#141416]"
                    onClick={(event) =>
                      createNewPrivateConversation(event, e._id)
                    }
                  >
                    <Image
                      src={
                        e.profile_image
                          ? e.profile_image
                          : "/images/bg-promotion2.png"
                      }
                      width={40}
                      height={40}
                      alt="avatar"
                      className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                    />
                    <p className="text-sm font-medium text-white">
                      {e.display_name?.length ? e.display_name : e._id}
                    </p>
                  </button>
                ))}

              {loading && networkData.length == 0 && <p> No any contact</p>}

              {!loading ? (
                <div className="mx-auto w-[90%]">
                  <ChatFriendListSkeleton />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewConversationModal;
