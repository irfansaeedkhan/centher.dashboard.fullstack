export function eqAddress(addressOne: any, addressTwo: any): boolean {
  if (addressOne?.toLowerCase() == addressTwo?.toLowerCase()) {
    return true;
  } else return false;
}
