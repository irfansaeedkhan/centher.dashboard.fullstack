export const sliceDisplayName = (
  displayName: string | null | undefined,
  variant?: "cropname"
) => {
  if (displayName && displayName.length > 15 && variant === "cropname") {
    return `${displayName?.slice(0, 15)}...`;
  } else {
    return displayName;
  }
};
