import React from "react";
import clsx from "clsx";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

export const CoverUploadButton: React.FC<CoverUploadButtonProps> = ({
  children,
  variant = "brand",
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
  `flex items-center gap-3 rounded-xl px-4 py-2 font-semibold text-14px`,
  {
    variants: {
      variant: {
        brand: `bg-brand-primary hover:bg-brand-primary-dark text-black-shade-3`,
        dark: `bg-black-shade-3 hover:bg-black-shade-4 text-white`,
      },
    },
    defaultVariants: {
      variant: "brand",
    },
  }
);
