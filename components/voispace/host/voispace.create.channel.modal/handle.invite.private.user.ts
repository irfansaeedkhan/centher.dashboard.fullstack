import { search } from "@/lib/search";

export const handleInvitePrivateUser = async (
  event: React.ChangeEvent<HTMLInputElement>,
  setSearchResults: React.Dispatch<React.SetStateAction<any[]>>,
  setSearchedValue: React.Dispatch<React.SetStateAction<string>>
) => {
  const value = event.target.value;
  setSearchedValue(value);

  if (!value.trim()) {
    setSearchResults([]);
    return;
  }

  try {
    const results = await search(value);
    setSearchResults(results);
  } catch {
    setSearchResults([]);
  }
};
