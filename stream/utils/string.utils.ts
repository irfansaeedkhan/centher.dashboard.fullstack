export function areStringsEquals(
  stringOne: string,
  stringTwo: string
): boolean {
  if (
    stringOne?.length &&
    stringTwo?.length &&
    stringOne.toLowerCase().trim() === stringTwo.toLowerCase().trim()
  ) {
    return true;
  }

  return false;
}
