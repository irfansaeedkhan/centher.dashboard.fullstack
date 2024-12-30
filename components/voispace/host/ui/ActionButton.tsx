import React from "react";

interface ActionButtonProps {
  text?: string;
  className: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  className = "text-red",
  onClick,
  children,
}) => {
  return (
    <button
      className={`flex items-center gap-[6px] rounded-[1000px] bg-[#212228] p-[10px] text-white ${className}`}
      onClick={onClick}
    >
      {children || text}
    </button>
  );
};

export default ActionButton;
