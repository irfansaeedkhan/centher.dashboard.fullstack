import React from "react";
import { FormState } from "../../index.page";

interface Props {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
}

const RoundsSettingsForm: React.FC<Props> = ({ formState, setFormState }) => {
  return <div>RoundsSettingsForm</div>;
};

export default RoundsSettingsForm;
