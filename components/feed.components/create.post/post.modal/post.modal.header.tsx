import React from "react";
import { IoClose } from "react-icons/io5";

interface Props {
  title: string;
  onClickClose: () => void;
}

const PostModalHeader: React.FC<Props> = ({ title, onClickClose }) => {
  return (
    <div
      className={`flex items-center p-3 border-b-2 border-gray-shade-3 border-opacity-40`}
    >
      <h3
        className={`flex-grow text-white text-base fsm:text-xl text-center font-semibold`}
      >
        {title}
      </h3>

      <button onClick={onClickClose}>
        <IoClose className="fill-white w-5 h-5" />
      </button>
    </div>
  );
};

export default PostModalHeader;
