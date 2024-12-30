import React from "react";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="min-h-[642px] w-[100%] max-w-[761px] overflow-hidden rounded-[24px] bg-[#0B0B0B] shadow-lg">
        {children}
      </div>
    </div>
  );
}
