import React, { use, useState } from "react";

import { SearchIcon } from "@/assets/svgs";
import InviteRow from "@/components/voispace/host/partials/InviteRow";
import { users } from "@/components/voispace/dummy.data/users.list";

import HostModalHeader from "./partials/HostModalHeader";
import { Room } from "./voispace.create.channel.modal/voispace.create.channel.modal";
import { useStream } from "@/hooks/stream/use.core";

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
  const { useQueryToGetInvitedUsersByBrooadcastId } = useStream();
  const { data, loader } = useQueryToGetInvitedUsersByBrooadcastId(
    roomData?.id as string
  );

  const currentPeople = data?.data?.invitedUsers;
  const [searchedValue, setSearchedValue] = useState("");
  const filteredUsers = users.filter((user) => {
    return user.name.toLowerCase().includes(searchedValue.toLowerCase());
  });

  const handleInvitePrivateUser = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchedValue(event.target.value);
  };

  return (
    <div className="px-[24px] py-[24px] text-white">
      <div className="flex flex-col gap-[27px]">
        <HostModalHeader
          subTitle="The Room of Traders"
          title="Invite to Room"
          onClose={onClose}
          onBack={() => setComponentName("Participators")}
        />

        <div className="flex flex-col gap-[16px]">
          <div className="relative rounded-xl bg-[#141416] px-3 py-1">
            <div className="flex items-center">
              <SearchIcon className="h-7 w-7 opacity-70" />
              <input
                className="w-full border-none bg-[#141416] text-sm font-medium text-white focus:outline-none focus:ring-0"
                placeholder="Invite people"
                value={searchedValue}
                onChange={handleInvitePrivateUser}
              />
            </div>
          </div>

          <div>
            {filteredUsers.map((user, index) => {
              return <InviteRow key={index} user={user} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitetoRoom;
