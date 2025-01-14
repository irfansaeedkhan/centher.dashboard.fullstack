import React from "react";

interface ChipsProps {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const Chips: React.FC<ChipsProps> = ({
  className = "p-[4px] rounded-[1000px] flex items-center justify-center bg-[#212228]",
  onClick,
  children,
}) => {
  return (
    <span className={`relative ${className}`} onClick={onClick}>
      {children}
    </span>
  );
};

export default Chips;
