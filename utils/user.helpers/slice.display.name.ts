export const sliceDisplayName = (displayName: string | null | undefined) => {
  if (displayName && displayName.length > 16) {
    return `${displayName?.slice(0, 4)}...${displayName?.slice(-4)}`;
  } else {
    return displayName;
  }
};
