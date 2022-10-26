import React from "react";

export const NoPostMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="sm:w-full lg:w-[544px] py-4 rounded-10px bg-background-shade-3 text-gray-400 text-center">
      {message}
    </div>
  );
};
