import React from "react";

interface ActionButtonProps {
  id?: string;
  form?: string;
  type?: any;
  text?: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  form = "",
  id = "",
  type = "button",
  text,
  className = "text-red",
  onClick,
  children,
}) => {
  return (
    <button
      className={`flex items-center gap-[6px] rounded-[1000px] bg-[#212228] p-[10px] text-white ${className}`}
      onClick={onClick}
      form={form}
      id={id}
      type={type}
    >
      {children || text}
    </button>
  );
};

export default ActionButton;
