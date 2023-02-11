import React from "react";
import { IoClose } from "react-icons/io5";

interface Props {
  title: string;
  onClickClose: () => void;
}

const PostModalHeader: React.FC<Props> = ({ title, onClickClose }) => {
  return (
    <div
      className={`flex items-center border-b-2 border-gray-shade-3 border-opacity-40 p-3`}
    >
      <h3
        className={`flex-grow text-center text-base font-semibold text-white fsm:text-xl`}
      >
        {title}
      </h3>

      <button onClick={onClickClose}>
        <IoClose className="h-5 w-5 fill-white" />
      </button>
    </div>
  );
};

export default PostModalHeader;
