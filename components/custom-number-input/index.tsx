import React from "react";

interface CustomNumberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  refocusOnScroll?: boolean;
}

export const CustomNumberInput = React.forwardRef<
  HTMLInputElement,
  CustomNumberInputProps
>(({ refocusOnScroll = false, ...props }, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      type="number"
      onWheel={(e) => {
        const input = e.currentTarget;
        // Prevent the input value change
        input.blur();

        // Prevent the page/container scrolling
        e.stopPropagation();

        // Refocus immediately, on the next tick (after the current function is done)
        if (refocusOnScroll) {
          setTimeout(() => {
            input?.focus();
          }, 0);
        }
      }}
    />
  );
});
CustomNumberInput.displayName = "CustomNumberInput";
