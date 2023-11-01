import React from "react";
import { CustomModal } from "@/components/modal/custom.modal";
import Button from "@/components/button";

interface Props {
  setPropertyModal: (value: boolean) => void;
  propertyErr: string | null;
  propertyDetails: any;
  addNewPropertyFunc: () => void;
  handlePropertyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddPropertiesModal: React.FC<Props> = ({
  propertyErr,
  propertyDetails,
  setPropertyModal,
  addNewPropertyFunc,
  handlePropertyChange,
}) => {
  return (
    <CustomModal
      onClose={() => {
        setPropertyModal(false);
      }}
      title={"Add new properties"}
    >
      <div className={modalBodyWrapper}>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Name</label>
          <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
            <input
              type="text"
              name="PropertyName"
              id="PropertyName"
              autoComplete="off"
              placeholder="Male"
              className={inputFieldModal}
              onChange={handlePropertyChange}
              value={propertyDetails.PropertyName}
            />
          </div>
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Type</label>
          <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
            <input
              type="text"
              name="Type"
              id="Type"
              autoComplete="off"
              placeholder="Character"
              className={inputFieldModal}
              onChange={handlePropertyChange}
              value={propertyDetails.Type}
            />
          </div>
        </div>
        {propertyErr && (
          <p className={`text-red-500 ${errMessage}`}>{propertyErr}</p>
        )}
        <Button
          title={"Save"}
          variant="primary"
          onClick={addNewPropertyFunc}
          className="mt-2"
        />
      </div>
    </CustomModal>
  );
};

export default AddPropertiesModal;

// styling
const errMessage = `pb-2 text-xs font-medium`;
const fieldWrapper = `flex gap-2 flex-col w-full`;
const fieldTitle = `text-sm text-start font-normal text-white`;
const modalBodyWrapper = `flex flex-col gap-2 w-full mt-8 text-center p-[2px]`;
const inputFieldModal = `w-full py-3 px-5 bg-black-shade-2 text-white font-semibold text-sm rounded-lg border-0 focus:outline-none ring-black-shade-7 ring-2 focus:ring-0 active:!ring-0`;
