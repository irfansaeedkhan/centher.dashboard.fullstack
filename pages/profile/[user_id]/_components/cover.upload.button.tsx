import React from "react";
import clsx from "clsx";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

export const CoverUploadButton: React.FC<CoverUploadButtonProps> = ({
  children,
  variant = "edit-cover",
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(uploadButtonVariants({ variant }), className)}
      {...props}
    >
      {children}
    </button>
  );
};

interface CoverUploadButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof uploadButtonVariants> {
  children: React.ReactNode;
}

const uploadButtonVariants = cva(
  `flex items-center gap-2.5 rounded-lg px-3 py-1.5 font-semibold text-[13px]`,
  {
    variants: {
      variant: {
        "upload-cover": ``,
        "edit-cover": `bg-black bg-opacity-30 text-white`,
        cancel: ` text-white`,
      },
    },
    defaultVariants: {
      variant: "edit-cover",
    },
  }
);
