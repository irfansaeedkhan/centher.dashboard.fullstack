import React, { useEffect, useState } from "react";
import { SearchIcon } from "@/assets/svgs";
import InviteRow from "@/components/voispace/host/partials/InviteRow";
import HostModalHeader from "./partials/HostModalHeader";
import { Room } from "./voispace.create.channel.modal/voispace.create.channel.modal";
import { useStream } from "@/hooks/stream/use.core";
import { search } from "@/lib/search/search";
import { SearchResultWithType } from "@/lib/search/types";
import { areStringsEquals } from "@/stream/utils/string.utils";
import Button from "@/components/button";

interface DynamicProps {
  onClose: () => void;
  setComponentName: (name: string) => string;
  roomData: Room;
}

const InvitetoRoom: React.FC<DynamicProps> = ({
  onClose,
  setComponentName,
  roomData,
}) => {
  const [currentPeople, setCurrentPeople] = useState([]);
  const [newPeople, setNewPeople] = useState<SearchResultWithType[]>([]);
  const [searchedValue, setSearchedValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultWithType[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const { useQueryToGetInvitedUsersByBrooadcastId, amaAgent, liveAgent } =
    useStream();
  const { data, loader } = useQueryToGetInvitedUsersByBrooadcastId(
    roomData?.id as string
  );

  useEffect(() => {
    setCurrentPeople(data);
  }, [data]);

  const handleInvitePrivateUser = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchedValue(event.target.value);

    if (!event.target.value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await search(event.target.value);
      setSearchResults(
        results.filter(
          (e) =>
            [...currentPeople, ...newPeople].findIndex((s) =>
              areStringsEquals(s._id, e._id)
            ) == -1
        )
      );
    } catch (error) {
      setSearchResults([]);
    }
  };

  const handleAddUser = (user: SearchResultWithType) => {
    if ([...currentPeople, ...newPeople].find((u: any) => u._id === user._id)) {
      return;
    }
    setNewPeople((prev) => [...prev, user]);
    setSearchResults([]);
    setSearchedValue("");
  };

  const handleRemoveUser = (userId: string) => {
    setCurrentPeople((prev) => prev.filter((user: any) => user._id !== userId));
    setNewPeople((prev) => prev.filter((user) => user._id !== userId));
  };

  const applyChanges = async () => {
    setIsLoading(true);
    const usersToRemove = data
      ?.filter(
        (user: any) =>
          !currentPeople.some(
            (currentUser: any) => currentUser._id === user._id
          )
      )
      .map((e: any) => e._id);

    const usersToAdd = newPeople
      .filter(
        (user: any) =>
          !data?.some((existingUser: any) => existingUser._id === user._id)
      )
      .map((e: any) => e._id);

    const streamAgent = amaAgent.globalIsOwner ? amaAgent : liveAgent;

    if (usersToAdd && usersToAdd?.length > 0) {
      streamAgent.invite(usersToAdd);
    }

    if (usersToRemove && usersToRemove?.length > 0) {
      await Promise.all(
        usersToRemove.map((e: string) => streamAgent.kickUser(e))
      );
    }
    setIsLoading(false);
    setComponentName("TheRoomOfTraders");
  };

  return (
    <div className="px-[24px] py-[24px] text-white">
      <div className="flex flex-col gap-[27px]">
        <HostModalHeader
          subTitle="The Room of Traders"
          title="Invite to Room"
          onClose={onClose}
          hasBackButton={true}
          onBack={() => setComponentName("TheRoomOfTraders")}
        />

        <div className="flex flex-col gap-[16px]">
          <div className="relative rounded-xl bg-[#141416] px-3 py-1">
            <div className="flex items-center gap-2">
              <SearchIcon className="h-7 w-7 opacity-70" />
              <input
                className="flex-1 border-none bg-[#141416] text-sm font-medium text-white focus:outline-none focus:ring-0"
                placeholder="Invite people"
                value={searchedValue}
                onChange={handleInvitePrivateUser}
              />
              <Button
                title={isLoading ? "Loading..." : "Apply"}
                variant="primary"
                className="text-xs font-medium"
                borderRounded="10px"
                onClick={applyChanges}
                disabled={isLoading}
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full z-10 mt-1.5 w-full rounded-xl bg-[#141416] py-2">
                  {searchResults.map((user) => (
                    <div key={user._id}>
                      <InviteRow
                        user={user}
                        onAddClick={() => handleAddUser(user)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loader &&
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-700"></div>
                <div className="relative h-3 w-16 animate-pulse rounded-md bg-gray-700" />
              </div>
            ))}

          {newPeople.length > 0 && (
            <div className="mt-4">
              <div className="text-[#A0A4BB]">New Invites</div>
              {newPeople.map((user) => (
                <InviteRow
                  key={user._id}
                  user={user}
                  onRemoveClick={() => handleRemoveUser(user._id)}
                  onAddClick={undefined}
                />
              ))}
            </div>
          )}
          {currentPeople.length > 0 && (
            <div className="mt-4">
              <div className="text-[#A0A4BB]">Invited People</div>
              {currentPeople.map((user: any) => (
                <InviteRow
                  key={user._id}
                  user={user}
                  onRemoveClick={() => handleRemoveUser(user._id)}
                  onAddClick={undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitetoRoom;
