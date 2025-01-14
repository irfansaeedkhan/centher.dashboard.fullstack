export const handleInputChange = (
  field: string,
  value: any,
  setFormState: React.Dispatch<React.SetStateAction<any>>
) => {
  setFormState((prev: any) => ({
    ...prev,
    [field]: value,
  }));
};
