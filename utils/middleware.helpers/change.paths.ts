/**
 * Change the Next.js dynamic paths to colon format
 *
 * @example changePaths(["/users/[id]"]) => ["/users/:id"]
 */
export const changePaths = (paths: string[]) => {
  if (paths && paths.length > 0) {
    return paths.map((path) => {
      let changed = path;
      while (changed?.includes("[")) {
        changed = changed?.replace("[", ":");
      }
      changed?.replace("]", "");
      return changed;
    });
  } else {
    return [];
  }
};
