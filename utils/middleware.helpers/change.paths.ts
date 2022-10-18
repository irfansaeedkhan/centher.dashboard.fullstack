/**
 * Change the Next.js dynamic paths to colon format
 *
 * @example changePaths(["/users/[id]"]) => ["/users/:id"]
 */
export const changePaths = (paths: string[]) => {
  return paths.map((path) => {
    const changed = path.replaceAll("[", ":");
    return changed.replaceAll("]", "");
  });
};
